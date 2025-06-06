export const CreateBodyWithAllData =
  '{\n    "name": "test user",\n    "phoneNumber": "+123-456-789-1234",\n    "email": "test@email.com",\n   "address": {\n        "line1": "123 Test Street",\n        "town": "Test Town",\n        "county": "Test County",\n        "postcode": "TE5 6ST"\n    }\n}';

export const CreateBodyWithoutName =
  '{\n    "phoneNumber": "+123-456-789-1234",\n    "email": "test@email.com",\n   "address": {\n        "line1": "123 Test Street",\n        "town": "Test Town",\n        "county": "Test County",\n        "postcode": "TE5 6ST"\n    }\n}';

export const CreateBodyWithoutEmail =
  '{\n    "name": "test user",\n    "phoneNumber": "+123-456-789-1234",\n   "address": {\n        "line1": "123 Test Street",\n        "town": "Test Town",\n        "county": "Test County",\n        "postcode": "TE5 6ST"\n    }\n}';

export const CreateBodyWitWrongEmail =
  '{\n    "name": "test user",\n    "phoneNumber": "+123-456-789-1234",\n    "email": "testemail.com",\n   "address": {\n        "line1": "123 Test Street",\n        "town": "Test Town",\n        "county": "Test County",\n        "postcode": "TE5 6ST"\n    }\n}';

export const CreateBodyWithoutPhone =
  '{\n    "name": "test user",\n    "email": "test@email.com",\n   "address": {\n        "line1": "123 Test Street",\n        "town": "Test Town",\n        "county": "Test County",\n        "postcode": "TE5 6ST"\n    }\n}';

export const CreateBodyWithWrongPhone =
  '{\n    "name": "test user",\n    "phoneNumber": "1234",\n    "email": "test@email.com",\n   "address": {\n        "line1": "123 Test Street",\n        "town": "Test Town",\n        "county": "Test County",\n        "postcode": "TE5 6ST"\n    }\n}';

export const CreateBodyWithoutAddress = '{\n    "name": "test user",\n    "phoneNumber": "+123-456-789-1234",\n    "email": "test@email.com"\n}';
