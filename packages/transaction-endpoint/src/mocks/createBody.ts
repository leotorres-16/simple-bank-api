export const CreateDepositBodyWithAllData = '{\n    "amount": "100",    "currency": "GBP",    "type": "deposit"\n}';

export const CreateWithdrawalBodyWithAllData = '{\n    "amount": "100",    "currency": "GBP",    "type": "withdrawal"\n}';

export const CreateWithdrawalBodyMissingAmount = '{\n    "currency": "GBP",    "type": "withdrawal"\n}';

export const CreateWithdrawalBodyHighWithdrawal = '{\n    "amount": "1000000",    "currency": "GBP",    "type": "withdrawal"\n}';
