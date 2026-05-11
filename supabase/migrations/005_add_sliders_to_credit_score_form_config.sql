update credit_score_config
set
  config_value = (
    select jsonb_agg(
      case section->>'id'
        when 'income_stability' then section || jsonb_build_object(
          'sliders',
          jsonb_build_array(
            jsonb_build_object(
              'key', 'monthlyIncome',
              'label', 'Monthly Net Income (₦)',
              'min', 0,
              'max', 100000000,
              'step', 250000,
              'defaultValue', 0,
              'minLabel', '₦0',
              'maxLabel', '₦100M+',
              'format', 'currency'
            )
          )
        )
        when 'debt_to_income' then section || jsonb_build_object(
          'sliders',
          jsonb_build_array(
            jsonb_build_object(
              'key', 'obligations',
              'label', 'Existing Monthly Obligations (₦)',
              'min', 0,
              'max', 5000000,
              'step', 100000,
              'defaultValue', 0,
              'minLabel', '₦0',
              'maxLabel', '₦5M+',
              'format', 'currency'
            )
          )
        )
        when 'down_payment_strength' then section || jsonb_build_object(
          'sliders',
          jsonb_build_array(
            jsonb_build_object(
              'key', 'downPayment',
              'label', 'Down Payment Percentage',
              'min', 0,
              'max', 70,
              'step', 5,
              'defaultValue', 30,
              'minLabel', '0%',
              'maxLabel', '70%+',
              'format', 'percent'
            )
          )
        )
        else section
      end
      order by ordinality
    )
    from jsonb_array_elements(config_value) with ordinality as sections(section, ordinality)
  ),
  updated_at = now()
where config_key = 'credit_score_form';
