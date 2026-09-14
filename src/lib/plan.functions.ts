import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { EXAMPLE_SHOTS, type Shot } from "@/data/example-plan";
import { MODEL_NAMES, SHOT_COUNT, type ModelName } from "@/lib/pricing";

const Input = z.object({ brief: z.string().trim().min(1).max(4000) });

export type PlanResult = {
  source: "ai" | "example";
  shots: Shot[];
  notice?: string;
};

const shotSchema = {
  type: "object",
  additionalProperties: false,
  required: ["shots"],
  properties: {
    shots: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["scene", "onScreenText", "model"],
        properties: {
          scene: { type: "string" },
          onScreenText: { type: "string" },
          model: { type: "string", enum: MODEL_NAMES },
        },
      },
    },
  },
};

export const buildShotPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<PlanResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      return {
        source: "example",
        shots: EXAMPLE_SHOTS,
        notice:
          "AI planning is not connected on this instance, so Launchpad loaded the worked example plan. Edit any card to make it yours.",
      };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          stream: true,
          reasoning: { effort: "low", summary: "auto" },
          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: `You are a video ad director. Turn the brief into exactly ${SHOT_COUNT} shots for a 15 second vertical ad, 3 seconds each. Keep one recurring character consistent. onScreenText must be under 40 characters. Choose a model per shot from: ${MODEL_NAMES.join(", ")}.`,
                },
              ],
            },
            { role: "user", content: [{ type: "input_text", text: data.brief }] },
          ],
          text: { format: { type: "json_schema", name: "shot_plan", strict: true, schema: shotSchema } },
        }),
      });

      if (!res.ok || !res.body) throw new Error(`Gateway error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
              text += evt.delta;
            }
          } catch {
            /* ignore partial events */
          }
        }
      }

      const parsed = JSON.parse(text) as { shots?: Array<Partial<Shot>> };
      const shots = (parsed.shots ?? []).slice(0, SHOT_COUNT).map((s, i) => ({
        id: `shot-${i + 1}`,
        scene: String(s.scene ?? ""),
        onScreenText: String(s.onScreenText ?? ""),
        model: (MODEL_NAMES as string[]).includes(String(s.model))
          ? (s.model as ModelName)
          : ("Kling 3.0 Turbo" as ModelName),
      }));
      if (shots.length !== SHOT_COUNT) throw new Error("Incomplete plan");
      return { source: "ai", shots };
    } catch {
      return {
        source: "example",
        shots: EXAMPLE_SHOTS,
        notice:
          "The plan could not be generated just now, so Launchpad loaded the worked example plan instead. Everything below is editable.",
      };
    }
  });
