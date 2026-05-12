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
import { defaultKycConfig, normalizeKycConfig, type KycConfig } from "@/lib/kycConfig";
import { normalizeVehicleCatalog, vehicles, type Vehicle } from "@/lib/vehicleCatalog";

export type CreditScoreRuntimeConfig = {
  formConfig: CreditScoreFormConfig;
  formula: CreditScoreFormulaConfig;
  tiers: CreditScoreTierConfig[];
  kycConfig: KycConfig;
  vehicleCatalog: Vehicle[];
};

export async function getCreditScoreRuntimeConfig(): Promise<CreditScoreRuntimeConfig> {
  try {
    const service = await createServiceClient();
    const { data } = await service
      .from("credit_score_config")
      .select("config_key, config_value")
      .in("config_key", ["credit_score_form", "score_formula", "score_tiers", "kyc_config", "vehicle_catalog"]);

    const configMap = Object.fromEntries((data ?? []).map((item: any) => [item.config_key, item.config_value]));

    return {
      formConfig: normalizeCreditScoreFormConfig(configMap.credit_score_form),
      formula: normalizeCreditScoreFormula(configMap.score_formula),
      tiers: normalizeCreditScoreTiers(configMap.score_tiers),
      kycConfig: normalizeKycConfig(configMap.kyc_config),
      vehicleCatalog: normalizeVehicleCatalog(configMap.vehicle_catalog).filter((vehicle) => vehicle.enabled !== false),
    };
  } catch {
    return {
      formConfig: defaultCreditScoreForm,
      formula: defaultCreditScoreFormula,
      tiers: defaultCreditScoreTiers,
      kycConfig: defaultKycConfig,
      vehicleCatalog: vehicles,
    };
  }
}
