## To add a new lender rule filter

1. Edit `LENDER_RULES_VARIABLES` to add your new filter variable
2. Edit `LenderRulesInitializator`, and modify `getLenderRulesVariables` to get the value of your variable from the loan
3. Edit `LenderRulesFormOperator` and `LenderRulesFormValue` if this variable can only have specific values