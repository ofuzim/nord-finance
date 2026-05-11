import { createServiceClient } from "@/lib/supabase/server";
import {
  defaultCreditScoreForm,
  defaultCreditScoreFormula,
  defaultCreditScoreTiers,
  normalizeCreditScoreFormConfig,
  normalizeCreditScoreFormula,
  normalizeCreditScoreTiers,
  type CreditScoreFormConfig,
  type CreditScoreFormulaConfig,
  type CreditScoreTierConfig,
} from "@/lib/creditScoreModel";

export type CreditScoreRuntimeConfig = {
  formConfig: CreditScoreFormConfig;
  formula: CreditScoreFormulaConfig;
  tiers: CreditScoreTierConfig[];
};

export async function getCreditScoreRuntimeConfig(): Promise<CreditScoreRuntimeConfig> {
  try {
    const service = await createServiceClient();
    const { data } = await service
      .from("credit_score_config")
      .select("config_key, config_value")
      .in("config_key", ["credit_score_form", "score_formula", "score_tiers"]);

    const configMap = Object.fromEntries((data ?? []).map((item: any) => [item.config_key, item.config_value]));

    return {
      formConfig: normalizeCreditScoreFormConfig(configMap.credit_score_form),
      formula: normalizeCreditScoreFormula(configMap.score_formula),
      tiers: normalizeCreditScoreTiers(configMap.score_tiers),
    };
  } catch {
    return {
      formConfig: defaultCreditScoreForm,
      formula: defaultCreditScoreFormula,
      tiers: defaultCreditScoreTiers,
    };
  }
}
