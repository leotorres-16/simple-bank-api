export const CreateBodyWithAllData = '{\n    "name": "test account",    "accountType": "personal"\n}';

export const CreateBodyWithoutName = '{\n    "accountType": "personal"\n}';

export const CreateBodyWithoutAccountType = '{\n    "name": "test account"\n}';

export const CreateBodyWithInvalidAccountType = '{\n    "name": "test account",   "accountType": "invalid"\n}';
