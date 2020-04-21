const citiesCoordinates = [
  {
    "zipCode": 1000,
    "city": "Lausanne 25",
    "lat": 46.5182,
    "long": 6.6329
  },
  {
    "zipCode": 1000,
    "city": "Lausanne 26",
    "lat": 46.5182,
    "long": 6.6329
  },
  {
    "zipCode": 1000,
    "city": "Lausanne 27",
    "lat": 46.5182,
    "long": 6.6329
  },
  {
    "zipCode": 1001,
    "city": "Lausanne",
    "lat": 46.5218,
    "long": 6.633
  },
  {
    "zipCode": 1002,
    "city": "Lausanne",
    "lat": 46.5218,
    "long": 6.633
  },
  {
    "zipCode": 1003,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1004,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1005,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1006,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1007,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1008,
    "city": "Jouxtens-Mézery",
    "lat": 46.5556,
    "long": 6.6437
  },
  {
    "zipCode": 1008,
    "city": "Prilly",
    "lat": 46.537,
    "long": 6.6046
  },
  {
    "zipCode": 1009,
    "city": "Pully",
    "lat": 46.5103,
    "long": 6.6618
  },
  {
    "zipCode": 1010,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1011,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1012,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1014,
    "city": "Lausanne Adm cant",
    "lat": 46.5218,
    "long": 6.633
  },
  {
    "zipCode": 1015,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1017,
    "city": "Lausanne Veillon",
    "lat": 46.5218,
    "long": 6.633
  },
  {
    "zipCode": 1018,
    "city": "Lausanne",
    "lat": 46.516,
    "long": 6.6328
  },
  {
    "zipCode": 1019,
    "city": "Lausanne",
    "lat": 46.5218,
    "long": 6.633
  },
  {
    "zipCode": 1020,
    "city": "Renens VD",
    "lat": 46.5399,
    "long": 6.5881
  },
  {
    "zipCode": 1022,
    "city": "Chavannes-près-Renens",
    "lat": 46.5301,
    "long": 6.5707
  },
  {
    "zipCode": 1023,
    "city": "Crissier",
    "lat": 46.5459,
    "long": 6.5757
  },
  {
    "zipCode": 1024,
    "city": "Ecublens VD",
    "lat": 46.529,
    "long": 6.5626
  },
  {
    "zipCode": 1025,
    "city": "St-Sulpice VD",
    "lat": 46.5105,
    "long": 6.559
  },
  {
    "zipCode": 1026,
    "city": "Denges",
    "lat": 46.522,
    "long": 6.5393
  },
  {
    "zipCode": 1026,
    "city": "Echandens",
    "lat": 46.5397,
    "long": 6.5379
  },
  {
    "zipCode": 1027,
    "city": "Lonay",
    "lat": 46.5288,
    "long": 6.5194
  },
  {
    "zipCode": 1028,
    "city": "Préverenges",
    "lat": 46.5185,
    "long": 6.5268
  },
  {
    "zipCode": 1029,
    "city": "Villars-Ste-Croix",
    "lat": 46.5656,
    "long": 6.5633
  },
  {
    "zipCode": 1030,
    "city": "Bussigny",
    "lat": 46.5511,
    "long": 6.556
  },
  {
    "zipCode": 1031,
    "city": "Mex VD",
    "lat": 46.5759,
    "long": 6.5545
  },
  {
    "zipCode": 1032,
    "city": "Romanel-sur-Lausanne",
    "lat": 46.564,
    "long": 6.6054
  },
  {
    "zipCode": 1033,
    "city": "Cheseaux-sur-Lausanne",
    "lat": 46.5862,
    "long": 6.6059
  },
  {
    "zipCode": 1034,
    "city": "Boussens",
    "lat": 46.6033,
    "long": 6.586
  },
  {
    "zipCode": 1035,
    "city": "Bournens",
    "lat": 46.6049,
    "long": 6.5648
  },
  {
    "zipCode": 1036,
    "city": "Sullens",
    "lat": 46.5956,
    "long": 6.5669
  },
  {
    "zipCode": 1037,
    "city": "Etagnières",
    "lat": 46.6015,
    "long": 6.6065
  },
  {
    "zipCode": 1038,
    "city": "Bercher",
    "lat": 46.6914,
    "long": 6.7076
  },
  {
    "zipCode": 1039,
    "city": "Cheseaux Polyval",
    "lat": 46.5845,
    "long": 6.5955
  },
  {
    "zipCode": 1040,
    "city": "Villars-le-Terroir",
    "lat": 46.6582,
    "long": 6.6439
  },
  {
    "zipCode": 1040,
    "city": "St-Barthélemy VD",
    "lat": 46.6349,
    "long": 6.6021
  },
  {
    "zipCode": 1040,
    "city": "Echallens",
    "lat": 46.6413,
    "long": 6.6332
  },
  {
    "zipCode": 1041,
    "city": "Naz",
    "lat": 46.6588,
    "long": 6.694
  },
  {
    "zipCode": 1041,
    "city": "Dommartin",
    "lat": 46.6485,
    "long": 6.7023
  },
  {
    "zipCode": 1041,
    "city": "Poliez-Pittet",
    "lat": 46.6273,
    "long": 6.6881
  },
  {
    "zipCode": 1041,
    "city": "Poliez-le-Grand",
    "lat": 46.6354,
    "long": 6.6662
  },
  {
    "zipCode": 1041,
    "city": "Montaubion-Chardonney",
    "lat": 46.6456,
    "long": 6.7139
  },
  {
    "zipCode": 1041,
    "city": "Bottens",
    "lat": 46.616,
    "long": 6.6615
  },
  {
    "zipCode": 1042,
    "city": "Bettens",
    "lat": 46.6283,
    "long": 6.5734
  },
  {
    "zipCode": 1042,
    "city": "Bioley-Orjulaz",
    "lat": 46.6214,
    "long": 6.5985
  },
  {
    "zipCode": 1042,
    "city": "Assens",
    "lat": 46.613,
    "long": 6.6218
  },
  {
    "zipCode": 1043,
    "city": "Sugnens",
    "lat": 46.6551,
    "long": 6.6714
  },
  {
    "zipCode": 1044,
    "city": "Fey",
    "lat": 46.6729,
    "long": 6.6801
  },
  {
    "zipCode": 1045,
    "city": "Ogens",
    "lat": 46.7084,
    "long": 6.7245
  },
  {
    "zipCode": 1046,
    "city": "Rueyres",
    "lat": 46.6934,
    "long": 6.6921
  },
  {
    "zipCode": 1047,
    "city": "Oppens",
    "lat": 46.714,
    "long": 6.6917
  },
  {
    "zipCode": 1052,
    "city": "Le Mont-sur-Lausanne",
    "lat": 46.5582,
    "long": 6.6315
  },
  {
    "zipCode": 1053,
    "city": "Bretigny-sur-Morrens",
    "lat": 46.5998,
    "long": 6.6431
  },
  {
    "zipCode": 1053,
    "city": "Cugy VD",
    "lat": 46.5862,
    "long": 6.6409
  },
  {
    "zipCode": 1054,
    "city": "Morrens VD",
    "lat": 46.5909,
    "long": 6.6223
  },
  {
    "zipCode": 1055,
    "city": "Froideville",
    "lat": 46.6012,
    "long": 6.6809
  },
  {
    "zipCode": 1058,
    "city": "Villars-Tiercelin",
    "lat": 46.6251,
    "long": 6.7038
  },
  {
    "zipCode": 1059,
    "city": "Peney-le-Jorat",
    "lat": 46.6323,
    "long": 6.7288
  },
  {
    "zipCode": 1061,
    "city": "Villars-Mendraz",
    "lat": 46.6459,
    "long": 6.7296
  },
  {
    "zipCode": 1062,
    "city": "Sottens",
    "lat": 46.6552,
    "long": 6.742
  },
  {
    "zipCode": 1063,
    "city": "Boulens",
    "lat": 46.6789,
    "long": 6.7183
  },
  {
    "zipCode": 1063,
    "city": "Martherenges",
    "lat": 46.6623,
    "long": 6.7557
  },
  {
    "zipCode": 1063,
    "city": "Chapelle-sur-Moudon",
    "lat": 46.6696,
    "long": 6.7357
  },
  {
    "zipCode": 1063,
    "city": "Peyres-Possens",
    "lat": 46.6703,
    "long": 6.7366
  },
  {
    "zipCode": 1066,
    "city": "Epalinges",
    "lat": 46.549,
    "long": 6.6683
  },
  {
    "zipCode": 1068,
    "city": "Les Monts-de-Pully",
    "lat": 46.5373,
    "long": 6.6876
  },
  {
    "zipCode": 1070,
    "city": "Puidoux",
    "lat": 46.5009,
    "long": 6.7825
  },
  {
    "zipCode": 1071,
    "city": "Rivaz",
    "lat": 46.4763,
    "long": 6.7788
  },
  {
    "zipCode": 1071,
    "city": "Chexbres",
    "lat": 46.4821,
    "long": 6.778
  },
  {
    "zipCode": 1071,
    "city": "St-Saphorin (Lavaux)",
    "lat": 46.4733,
    "long": 6.796
  },
  {
    "zipCode": 1072,
    "city": "Forel (Lavaux)",
    "lat": 46.5379,
    "long": 6.7629
  },
  {
    "zipCode": 1073,
    "city": "Savigny",
    "lat": 46.5384,
    "long": 6.7322
  },
  {
    "zipCode": 1073,
    "city": "Mollie-Margot",
    "lat": 46.558,
    "long": 6.7513
  },
  {
    "zipCode": 1076,
    "city": "Ferlens VD",
    "lat": 46.5881,
    "long": 6.7808
  },
  {
    "zipCode": 1077,
    "city": "Servion",
    "lat": 46.5731,
    "long": 6.7494
  },
  {
    "zipCode": 1078,
    "city": "Essertes",
    "lat": 46.5619,
    "long": 6.7864
  },
  {
    "zipCode": 1080,
    "city": "Les Cullayes",
    "lat": 46.5731,
    "long": 6.7494
  },
  {
    "zipCode": 1081,
    "city": "Montpreveyres",
    "lat": 46.5826,
    "long": 6.7411
  },
  {
    "zipCode": 1082,
    "city": "Corcelles-le-Jorat",
    "lat": 46.6013,
    "long": 6.7309
  },
  {
    "zipCode": 1083,
    "city": "Mézières VD",
    "lat": 46.5915,
    "long": 6.7657
  },
  {
    "zipCode": 1084,
    "city": "Carrouge VD",
    "lat": 46.5377,
    "long": 6.7677
  },
  {
    "zipCode": 1085,
    "city": "Vulliens",
    "lat": 46.6225,
    "long": 6.7935
  },
  {
    "zipCode": 1088,
    "city": "Ropraz",
    "lat": 46.6146,
    "long": 6.7535
  },
  {
    "zipCode": 1090,
    "city": "La Croix (Lutry)",
    "lat": 46.5179,
    "long": 6.7036
  },
  {
    "zipCode": 1091,
    "city": "Aran",
    "lat": 46.4993,
    "long": 6.7104
  },
  {
    "zipCode": 1091,
    "city": "Grandvaux",
    "lat": 46.4938,
    "long": 6.7161
  },
  {
    "zipCode": 1091,
    "city": "Chenaux",
    "lat": 46.4957,
    "long": 6.7302
  },
  {
    "zipCode": 1092,
    "city": "Belmont-sur-Lausanne",
    "lat": 46.5189,
    "long": 6.6764
  },
  {
    "zipCode": 1093,
    "city": "La Conversion",
    "lat": 46.5128,
    "long": 6.6774
  },
  {
    "zipCode": 1094,
    "city": "Paudex",
    "lat": 46.5055,
    "long": 6.6682
  },
  {
    "zipCode": 1095,
    "city": "Lutry",
    "lat": 46.5024,
    "long": 6.6865
  },
  {
    "zipCode": 1096,
    "city": "Villette (Lavaux)",
    "lat": 46.4957,
    "long": 6.709
  },
  {
    "zipCode": 1096,
    "city": "Cully",
    "lat": 46.4889,
    "long": 6.7294
  },
  {
    "zipCode": 1097,
    "city": "Riex",
    "lat": 46.4935,
    "long": 6.7356
  },
  {
    "zipCode": 1098,
    "city": "Epesses",
    "lat": 46.4913,
    "long": 6.7478
  },
  {
    "zipCode": 1110,
    "city": "Morges",
    "lat": 46.5113,
    "long": 6.4985
  },
  {
    "zipCode": 1112,
    "city": "Echichens",
    "lat": 46.5303,
    "long": 6.4968
  },
  {
    "zipCode": 1113,
    "city": "St-Saphorin-sur-Morges",
    "lat": 46.5469,
    "long": 6.4885
  },
  {
    "zipCode": 1114,
    "city": "Colombier VD",
    "lat": 46.5571,
    "long": 6.4728
  },
  {
    "zipCode": 1115,
    "city": "Vullierens",
    "lat": 46.574,
    "long": 6.4819
  },
  {
    "zipCode": 1116,
    "city": "Cottens VD",
    "lat": 46.5725,
    "long": 6.4564
  },
  {
    "zipCode": 1117,
    "city": "Grancy",
    "lat": 46.5921,
    "long": 6.4639
  },
  {
    "zipCode": 1121,
    "city": "Bremblens",
    "lat": 46.5483,
    "long": 6.5194
  },
  {
    "zipCode": 1122,
    "city": "Romanel-sur-Morges",
    "lat": 46.5561,
    "long": 6.5104
  },
  {
    "zipCode": 1123,
    "city": "Aclens",
    "lat": 46.5663,
    "long": 6.5115
  },
  {
    "zipCode": 1124,
    "city": "Gollion",
    "lat": 46.5852,
    "long": 6.5097
  },
  {
    "zipCode": 1125,
    "city": "Monnaz",
    "lat": 46.5325,
    "long": 6.4806
  },
  {
    "zipCode": 1126,
    "city": "Vaux-sur-Morges",
    "lat": 46.5385,
    "long": 6.4639
  },
  {
    "zipCode": 1127,
    "city": "Clarmont",
    "lat": 46.5464,
    "long": 6.4495
  },
  {
    "zipCode": 1128,
    "city": "Reverolle",
    "lat": 46.5428,
    "long": 6.4405
  },
  {
    "zipCode": 1131,
    "city": "Tolochenaz",
    "lat": 46.505,
    "long": 6.4728
  },
  {
    "zipCode": 1132,
    "city": "Lully VD",
    "lat": 46.5051,
    "long": 6.4648
  },
  {
    "zipCode": 1134,
    "city": "Chigny",
    "lat": 46.5197,
    "long": 6.4766
  },
  {
    "zipCode": 1134,
    "city": "Vufflens-le-Château",
    "lat": 46.5263,
    "long": 6.4721
  },
  {
    "zipCode": 1135,
    "city": "Denens",
    "lat": 46.5177,
    "long": 6.4529
  },
  {
    "zipCode": 1136,
    "city": "Bussy-Chardonney",
    "lat": 46.5305,
    "long": 6.4425
  },
  {
    "zipCode": 1141,
    "city": "Sévery",
    "lat": 46.5735,
    "long": 6.4417
  },
  {
    "zipCode": 1142,
    "city": "Pampigny",
    "lat": 46.5809,
    "long": 6.4294
  },
  {
    "zipCode": 1143,
    "city": "Apples",
    "lat": 46.5524,
    "long": 6.4289
  },
  {
    "zipCode": 1144,
    "city": "Ballens",
    "lat": 46.5548,
    "long": 6.3731
  },
  {
    "zipCode": 1145,
    "city": "Bière",
    "lat": 46.5376,
    "long": 6.3336
  },
  {
    "zipCode": 1146,
    "city": "Mollens VD",
    "lat": 46.5776,
    "long": 6.3632
  },
  {
    "zipCode": 1147,
    "city": "Montricher",
    "lat": 46.5996,
    "long": 6.3767
  },
  {
    "zipCode": 1148,
    "city": "La Praz",
    "lat": 46.6675,
    "long": 6.4271
  },
  {
    "zipCode": 1148,
    "city": "Villars-Bozon",
    "lat": 46.6065,
    "long": 6.4067
  },
  {
    "zipCode": 1148,
    "city": "Cuarnens",
    "lat": 46.6255,
    "long": 6.4371
  },
  {
    "zipCode": 1148,
    "city": "Moiry VD",
    "lat": 46.6491,
    "long": 6.4534
  },
  {
    "zipCode": 1148,
    "city": "Mauraz",
    "lat": 46.6056,
    "long": 6.4207
  },
  {
    "zipCode": 1148,
    "city": "Mont-la-Ville",
    "lat": 46.6466,
    "long": 6.409
  },
  {
    "zipCode": 1148,
    "city": "Chavannes-le-Veyron",
    "lat": 46.607,
    "long": 6.4509
  },
  {
    "zipCode": 1148,
    "city": "La Coudre",
    "lat": 46.6404,
    "long": 6.4036
  },
  {
    "zipCode": 1148,
    "city": "L'Isle",
    "lat": 46.6184,
    "long": 6.4133
  },
  {
    "zipCode": 1149,
    "city": "Berolle",
    "lat": 46.558,
    "long": 6.3355
  },
  {
    "zipCode": 1162,
    "city": "St-Prex",
    "lat": 46.4796,
    "long": 6.4599
  },
  {
    "zipCode": 1163,
    "city": "Etoy",
    "lat": 46.4859,
    "long": 6.4182
  },
  {
    "zipCode": 1164,
    "city": "Buchillon",
    "lat": 46.4698,
    "long": 6.4178
  },
  {
    "zipCode": 1165,
    "city": "Allaman",
    "lat": 46.4701,
    "long": 6.3964
  },
  {
    "zipCode": 1166,
    "city": "Perroy",
    "lat": 46.4669,
    "long": 6.3535
  },
  {
    "zipCode": 1167,
    "city": "Lussy-sur-Morges",
    "lat": 46.5041,
    "long": 6.45
  },
  {
    "zipCode": 1168,
    "city": "Villars-sous-Yens",
    "lat": 46.5092,
    "long": 6.4293
  },
  {
    "zipCode": 1169,
    "city": "Yens",
    "lat": 46.519,
    "long": 6.4185
  },
  {
    "zipCode": 1170,
    "city": "Aubonne",
    "lat": 46.4951,
    "long": 6.3916
  },
  {
    "zipCode": 1172,
    "city": "Bougy-Villars",
    "lat": 46.4819,
    "long": 6.3536
  },
  {
    "zipCode": 1173,
    "city": "Féchy",
    "lat": 46.4788,
    "long": 6.3728
  },
  {
    "zipCode": 1174,
    "city": "Montherod",
    "lat": 46.5017,
    "long": 6.3615
  },
  {
    "zipCode": 1174,
    "city": "Pizy",
    "lat": 46.4939,
    "long": 6.3478
  },
  {
    "zipCode": 1175,
    "city": "Lavigny",
    "lat": 46.5012,
    "long": 6.4109
  },
  {
    "zipCode": 1176,
    "city": "St-Livres",
    "lat": 46.5079,
    "long": 6.3875
  },
  {
    "zipCode": 1180,
    "city": "Tartegnin",
    "lat": 46.4662,
    "long": 6.3125
  },
  {
    "zipCode": 1180,
    "city": "Rolle",
    "lat": 46.4582,
    "long": 6.335
  },
  {
    "zipCode": 1182,
    "city": "Gilly",
    "lat": 46.4578,
    "long": 6.2965
  },
  {
    "zipCode": 1183,
    "city": "Bursins",
    "lat": 46.4528,
    "long": 6.2914
  },
  {
    "zipCode": 1184,
    "city": "Vinzel",
    "lat": 46.4483,
    "long": 6.2782
  },
  {
    "zipCode": 1184,
    "city": "Luins",
    "lat": 46.442,
    "long": 6.2727
  },
  {
    "zipCode": 1185,
    "city": "Mont-sur-Rolle",
    "lat": 46.4702,
    "long": 6.3352
  },
  {
    "zipCode": 1186,
    "city": "Essertines-sur-Rolle",
    "lat": 46.4931,
    "long": 6.3177
  },
  {
    "zipCode": 1187,
    "city": "St-Oyens",
    "lat": 46.4994,
    "long": 6.3033
  },
  {
    "zipCode": 1188,
    "city": "Gimel",
    "lat": 46.5095,
    "long": 6.3074
  },
  {
    "zipCode": 1188,
    "city": "St-George",
    "lat": 46.5143,
    "long": 6.2598
  },
  {
    "zipCode": 1189,
    "city": "Saubraz",
    "lat": 46.5161,
    "long": 6.3302
  },
  {
    "zipCode": 1195,
    "city": "Dully",
    "lat": 46.4314,
    "long": 6.2946
  },
  {
    "zipCode": 1195,
    "city": "Bursinel",
    "lat": 46.4396,
    "long": 6.3058
  },
  {
    "zipCode": 1196,
    "city": "Gland",
    "lat": 46.4208,
    "long": 6.2701
  },
  {
    "zipCode": 1197,
    "city": "Prangins",
    "lat": 46.3952,
    "long": 6.2496
  },
  {
    "zipCode": 1200,
    "city": "Genève",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1201,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1202,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1203,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1204,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1205,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1206,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1207,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1208,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1209,
    "city": "Genève",
    "lat": 46.2022,
    "long": 6.1457
  },
  {
    "zipCode": 1211,
    "city": "Genève 19",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 71 CS CP",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 11",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 4",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 20",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 13",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 73",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 6",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 70",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 5",
    "lat": 46.2358,
    "long": 6.1192
  },
  {
    "zipCode": 1211,
    "city": "Genève 84 Votation",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 23",
    "lat": 46.2322,
    "long": 6.0791
  },
  {
    "zipCode": 1211,
    "city": "Genève 3",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 26",
    "lat": 46.1897,
    "long": 6.1158
  },
  {
    "zipCode": 1211,
    "city": "Genève 22",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 27",
    "lat": 46.2379,
    "long": 6.1424
  },
  {
    "zipCode": 1211,
    "city": "Genève 14",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 1",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 8",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 2",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 28",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 12",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1211,
    "city": "Genève 10",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1212,
    "city": "Grand-Lancy",
    "lat": 46.1788,
    "long": 6.1229
  },
  {
    "zipCode": 1213,
    "city": "Onex",
    "lat": 46.184,
    "long": 6.1024
  },
  {
    "zipCode": 1213,
    "city": "Petit-Lancy",
    "lat": 46.1965,
    "long": 6.1136
  },
  {
    "zipCode": 1214,
    "city": "Vernier",
    "lat": 46.217,
    "long": 6.085
  },
  {
    "zipCode": 1215,
    "city": "Genève",
    "lat": 46.2358,
    "long": 6.1192
  },
  {
    "zipCode": 1216,
    "city": "Cointrin",
    "lat": 46.2267,
    "long": 6.1055
  },
  {
    "zipCode": 1217,
    "city": "Meyrin",
    "lat": 46.2342,
    "long": 6.0802
  },
  {
    "zipCode": 1218,
    "city": "Le Grand-Saconnex",
    "lat": 46.2319,
    "long": 6.1209
  },
  {
    "zipCode": 1219,
    "city": "Châtelaine",
    "lat": 46.2114,
    "long": 6.1089
  },
  {
    "zipCode": 1219,
    "city": "Le Lignon",
    "lat": 46.2074,
    "long": 6.0984
  },
  {
    "zipCode": 1219,
    "city": "Aïre",
    "lat": 46.1951,
    "long": 6.0995
  },
  {
    "zipCode": 1220,
    "city": "Les Avanchets",
    "lat": 46.2217,
    "long": 6.1081
  },
  {
    "zipCode": 1222,
    "city": "Vésenaz",
    "lat": 46.2403,
    "long": 6.1975
  },
  {
    "zipCode": 1223,
    "city": "Cologny",
    "lat": 46.2167,
    "long": 6.1804
  },
  {
    "zipCode": 1224,
    "city": "Chêne-Bougeries",
    "lat": 46.1984,
    "long": 6.1864
  },
  {
    "zipCode": 1225,
    "city": "Chêne-Bourg",
    "lat": 46.1953,
    "long": 6.1941
  },
  {
    "zipCode": 1226,
    "city": "Thônex",
    "lat": 46.1881,
    "long": 6.199
  },
  {
    "zipCode": 1227,
    "city": "Carouge GE",
    "lat": 46.1917,
    "long": 6.1361
  },
  {
    "zipCode": 1227,
    "city": "Les Acacias",
    "lat": 46.1917,
    "long": 6.1361
  },
  {
    "zipCode": 1228,
    "city": "Plan-les-Ouates",
    "lat": 46.1679,
    "long": 6.1166
  },
  {
    "zipCode": 1231,
    "city": "Conches",
    "lat": 46.185,
    "long": 6.1739
  },
  {
    "zipCode": 1232,
    "city": "Confignon",
    "lat": 46.1734,
    "long": 6.0844
  },
  {
    "zipCode": 1233,
    "city": "Bernex",
    "lat": 46.1765,
    "long": 6.0754
  },
  {
    "zipCode": 1234,
    "city": "Vessy",
    "lat": 46.1831,
    "long": 6.1668
  },
  {
    "zipCode": 1236,
    "city": "Cartigny",
    "lat": 46.1741,
    "long": 6.0198
  },
  {
    "zipCode": 1237,
    "city": "Avully",
    "lat": 46.1701,
    "long": 6.0046
  },
  {
    "zipCode": 1239,
    "city": "Collex",
    "lat": 46.2715,
    "long": 6.1233
  },
  {
    "zipCode": 1240,
    "city": "Genève",
    "lat": 46.2058,
    "long": 6.1416
  },
  {
    "zipCode": 1241,
    "city": "Puplinge",
    "lat": 46.2104,
    "long": 6.2311
  },
  {
    "zipCode": 1242,
    "city": "Satigny",
    "lat": 46.2146,
    "long": 6.0355
  },
  {
    "zipCode": 1243,
    "city": "Presinge",
    "lat": 46.2198,
    "long": 6.2552
  },
  {
    "zipCode": 1244,
    "city": "Choulex",
    "lat": 46.2263,
    "long": 6.2238
  },
  {
    "zipCode": 1245,
    "city": "Collonge-Bellerive",
    "lat": 46.2504,
    "long": 6.1959
  },
  {
    "zipCode": 1246,
    "city": "Corsier GE",
    "lat": 46.263,
    "long": 6.2246
  },
  {
    "zipCode": 1247,
    "city": "Anières",
    "lat": 46.2767,
    "long": 6.222
  },
  {
    "zipCode": 1248,
    "city": "Hermance",
    "lat": 46.3014,
    "long": 6.2433
  },
  {
    "zipCode": 1251,
    "city": "Gy",
    "lat": 46.2532,
    "long": 6.2591
  },
  {
    "zipCode": 1252,
    "city": "Meinier",
    "lat": 46.2471,
    "long": 6.2342
  },
  {
    "zipCode": 1253,
    "city": "Vandoeuvres",
    "lat": 46.2218,
    "long": 6.2029
  },
  {
    "zipCode": 1254,
    "city": "Jussy",
    "lat": 46.2359,
    "long": 6.267
  },
  {
    "zipCode": 1255,
    "city": "Veyrier",
    "lat": 46.167,
    "long": 6.1844
  },
  {
    "zipCode": 1256,
    "city": "Troinex",
    "lat": 46.1631,
    "long": 6.1475
  },
  {
    "zipCode": 1257,
    "city": "La Croix-de-Rozon",
    "lat": 46.1454,
    "long": 6.1364
  },
  {
    "zipCode": 1258,
    "city": "Perly",
    "lat": 46.157,
    "long": 6.0923
  },
  {
    "zipCode": 1260,
    "city": "Nyon",
    "lat": 46.3832,
    "long": 6.2395
  },
  {
    "zipCode": 1261,
    "city": "Longirod",
    "lat": 46.495,
    "long": 6.2584
  },
  {
    "zipCode": 1261,
    "city": "Marchissy",
    "lat": 46.4881,
    "long": 6.2466
  },
  {
    "zipCode": 1261,
    "city": "Le Vaud",
    "lat": 46.4775,
    "long": 6.236
  },
  {
    "zipCode": 1262,
    "city": "Eysins",
    "lat": 46.3817,
    "long": 6.207
  },
  {
    "zipCode": 1263,
    "city": "Crassier",
    "lat": 46.3746,
    "long": 6.1637
  },
  {
    "zipCode": 1264,
    "city": "St-Cergue",
    "lat": 46.4459,
    "long": 6.1574
  },
  {
    "zipCode": 1265,
    "city": "La Cure",
    "lat": 46.4647,
    "long": 6.0742
  },
  {
    "zipCode": 1266,
    "city": "Duillier",
    "lat": 46.4092,
    "long": 6.2298
  },
  {
    "zipCode": 1267,
    "city": "Vich",
    "lat": 46.4292,
    "long": 6.2501
  },
  {
    "zipCode": 1267,
    "city": "Coinsins",
    "lat": 46.4239,
    "long": 6.2356
  },
  {
    "zipCode": 1268,
    "city": "Burtigny",
    "lat": 46.4675,
    "long": 6.2571
  },
  {
    "zipCode": 1268,
    "city": "Begnins",
    "lat": 46.4415,
    "long": 6.2476
  },
  {
    "zipCode": 1269,
    "city": "Bassins",
    "lat": 46.4627,
    "long": 6.2362
  },
  {
    "zipCode": 1270,
    "city": "Trélex",
    "lat": 46.4154,
    "long": 6.2081
  },
  {
    "zipCode": 1271,
    "city": "Givrins",
    "lat": 46.4297,
    "long": 6.2021
  },
  {
    "zipCode": 1272,
    "city": "Genolier",
    "lat": 46.4354,
    "long": 6.2181
  },
  {
    "zipCode": 1273,
    "city": "Arzier-Le Muids",
    "lat": 46.4596,
    "long": 6.2081
  },
  {
    "zipCode": 1274,
    "city": "Signy",
    "lat": 46.3917,
    "long": 6.2029
  },
  {
    "zipCode": 1274,
    "city": "Grens",
    "lat": 46.394,
    "long": 6.1911
  },
  {
    "zipCode": 1275,
    "city": "Chéserex",
    "lat": 46.3993,
    "long": 6.174
  },
  {
    "zipCode": 1276,
    "city": "Gingins",
    "lat": 46.4091,
    "long": 6.1781
  },
  {
    "zipCode": 1277,
    "city": "Arnex-sur-Nyon",
    "lat": 46.3729,
    "long": 6.1898
  },
  {
    "zipCode": 1277,
    "city": "Borex",
    "lat": 46.3789,
    "long": 6.1762
  },
  {
    "zipCode": 1278,
    "city": "La Rippe",
    "lat": 46.381,
    "long": 6.1505
  },
  {
    "zipCode": 1279,
    "city": "Bogis-Bossey",
    "lat": 46.3537,
    "long": 6.166
  },
  {
    "zipCode": 1279,
    "city": "Chavannes-de-Bogis",
    "lat": 46.3454,
    "long": 6.162
  },
  {
    "zipCode": 1281,
    "city": "Russin",
    "lat": 46.187,
    "long": 6.0138
  },
  {
    "zipCode": 1283,
    "city": "Dardagny",
    "lat": 46.1956,
    "long": 5.995
  },
  {
    "zipCode": 1283,
    "city": "La Plaine",
    "lat": 46.1773,
    "long": 6.0011
  },
  {
    "zipCode": 1284,
    "city": "Chancy",
    "lat": 46.15,
    "long": 5.9715
  },
  {
    "zipCode": 1285,
    "city": "Athenaz (Avusy)",
    "lat": 46.1518,
    "long": 6.0021
  },
  {
    "zipCode": 1286,
    "city": "Soral",
    "lat": 46.1437,
    "long": 6.0428
  },
  {
    "zipCode": 1287,
    "city": "Laconnex",
    "lat": 46.157,
    "long": 6.0313
  },
  {
    "zipCode": 1288,
    "city": "Aire-la-Ville",
    "lat": 46.1906,
    "long": 6.0429
  },
  {
    "zipCode": 1290,
    "city": "Versoix",
    "lat": 46.2838,
    "long": 6.1621
  },
  {
    "zipCode": 1290,
    "city": "Chavannes-des-Bois",
    "lat": 46.314,
    "long": 6.135
  },
  {
    "zipCode": 1291,
    "city": "Commugny",
    "lat": 46.321,
    "long": 6.1712
  },
  {
    "zipCode": 1292,
    "city": "Chambésy",
    "lat": 46.2441,
    "long": 6.1444
  },
  {
    "zipCode": 1293,
    "city": "Bellevue",
    "lat": 46.2574,
    "long": 6.1547
  },
  {
    "zipCode": 1294,
    "city": "Genthod",
    "lat": 46.2672,
    "long": 6.1556
  },
  {
    "zipCode": 1295,
    "city": "Mies",
    "lat": 46.3035,
    "long": 6.1633
  },
  {
    "zipCode": 1295,
    "city": "Tannay",
    "lat": 46.3088,
    "long": 6.1773
  },
  {
    "zipCode": 1296,
    "city": "Coppet",
    "lat": 46.3168,
    "long": 6.1911
  },
  {
    "zipCode": 1297,
    "city": "Founex",
    "lat": 46.3328,
    "long": 6.1924
  },
  {
    "zipCode": 1298,
    "city": "Céligny",
    "lat": 46.3507,
    "long": 6.195
  },
  {
    "zipCode": 1298,
    "city": "Céligny",
    "lat": 46.3507,
    "long": 6.195
  },
  {
    "zipCode": 1299,
    "city": "Crans-près-Céligny",
    "lat": 46.3591,
    "long": 6.2058
  },
  {
    "zipCode": 1302,
    "city": "Vufflens-la-Ville",
    "lat": 46.5752,
    "long": 6.5372
  },
  {
    "zipCode": 1303,
    "city": "Penthaz",
    "lat": 46.5987,
    "long": 6.5413
  },
  {
    "zipCode": 1304,
    "city": "Cossonay-Ville",
    "lat": 46.6144,
    "long": 6.5063
  },
  {
    "zipCode": 1304,
    "city": "Senarclens",
    "lat": 46.5979,
    "long": 6.4854
  },
  {
    "zipCode": 1304,
    "city": "Allens",
    "lat": 46.6009,
    "long": 6.5109
  },
  {
    "zipCode": 1304,
    "city": "Dizy",
    "lat": 46.6354,
    "long": 6.4965
  },
  {
    "zipCode": 1305,
    "city": "Penthalaz",
    "lat": 46.6108,
    "long": 6.5252
  },
  {
    "zipCode": 1306,
    "city": "Daillens",
    "lat": 46.6211,
    "long": 6.5487
  },
  {
    "zipCode": 1307,
    "city": "Lussery-Villars",
    "lat": 46.6328,
    "long": 6.5256
  },
  {
    "zipCode": 1308,
    "city": "La Chaux (Cossonay)",
    "lat": 46.6171,
    "long": 6.4722
  },
  {
    "zipCode": 1312,
    "city": "Eclépens",
    "lat": 46.6482,
    "long": 6.5358
  },
  {
    "zipCode": 1313,
    "city": "Ferreyres",
    "lat": 46.658,
    "long": 6.4852
  },
  {
    "zipCode": 1315,
    "city": "La Sarraz",
    "lat": 46.6586,
    "long": 6.5108
  },
  {
    "zipCode": 1316,
    "city": "Chevilly",
    "lat": 46.6427,
    "long": 6.4766
  },
  {
    "zipCode": 1317,
    "city": "Orny",
    "lat": 46.6676,
    "long": 6.5264
  },
  {
    "zipCode": 1318,
    "city": "Pompaples",
    "lat": 46.667,
    "long": 6.5097
  },
  {
    "zipCode": 1321,
    "city": "Arnex-sur-Orbe",
    "lat": 46.69,
    "long": 6.5169
  },
  {
    "zipCode": 1322,
    "city": "Croy",
    "lat": 46.6938,
    "long": 6.4757
  },
  {
    "zipCode": 1323,
    "city": "Romainmôtier",
    "lat": 46.6939,
    "long": 6.4609
  },
  {
    "zipCode": 1324,
    "city": "Premier",
    "lat": 46.7057,
    "long": 6.4499
  },
  {
    "zipCode": 1325,
    "city": "Vaulion",
    "lat": 46.6891,
    "long": 6.3894
  },
  {
    "zipCode": 1326,
    "city": "Juriens",
    "lat": 46.6885,
    "long": 6.4457
  },
  {
    "zipCode": 1329,
    "city": "Bretonnières",
    "lat": 46.7124,
    "long": 6.4696
  },
  {
    "zipCode": 1337,
    "city": "Vallorbe",
    "lat": 46.7126,
    "long": 6.3789
  },
  {
    "zipCode": 1338,
    "city": "Ballaigues",
    "lat": 46.7298,
    "long": 6.4136
  },
  {
    "zipCode": 1341,
    "city": "Orient",
    "lat": 46.6015,
    "long": 6.2394
  },
  {
    "zipCode": 1342,
    "city": "Le Pont",
    "lat": 46.6658,
    "long": 6.3309
  },
  {
    "zipCode": 1343,
    "city": "Les Charbonnières",
    "lat": 46.6667,
    "long": 6.3156
  },
  {
    "zipCode": 1344,
    "city": "L'Abbaye",
    "lat": 46.6497,
    "long": 6.3191
  },
  {
    "zipCode": 1345,
    "city": "Le Séchey",
    "lat": 46.6614,
    "long": 6.3009
  },
  {
    "zipCode": 1345,
    "city": "Le Lieu",
    "lat": 46.6478,
    "long": 6.2828
  },
  {
    "zipCode": 1346,
    "city": "Les Bioux",
    "lat": 46.6207,
    "long": 6.2699
  },
  {
    "zipCode": 1347,
    "city": "Le Solliat",
    "lat": 46.6211,
    "long": 6.2355
  },
  {
    "zipCode": 1347,
    "city": "Le Sentier",
    "lat": 46.608,
    "long": 6.2324
  },
  {
    "zipCode": 1348,
    "city": "Le Brassus",
    "lat": 46.5841,
    "long": 6.2123
  },
  {
    "zipCode": 1350,
    "city": "Orbe",
    "lat": 46.725,
    "long": 6.5307
  },
  {
    "zipCode": 1352,
    "city": "Agiez",
    "lat": 46.721,
    "long": 6.5075
  },
  {
    "zipCode": 1353,
    "city": "Bofflens",
    "lat": 46.7031,
    "long": 6.4948
  },
  {
    "zipCode": 1354,
    "city": "Montcherand",
    "lat": 46.7336,
    "long": 6.5082
  },
  {
    "zipCode": 1355,
    "city": "L'Abergement",
    "lat": 46.7542,
    "long": 6.485
  },
  {
    "zipCode": 1355,
    "city": "Sergey",
    "lat": 46.7493,
    "long": 6.5013
  },
  {
    "zipCode": 1356,
    "city": "Les Clées",
    "lat": 46.7379,
    "long": 6.4808
  },
  {
    "zipCode": 1356,
    "city": "La Russille",
    "lat": 46.7379,
    "long": 6.4808
  },
  {
    "zipCode": 1357,
    "city": "Lignerolle",
    "lat": 46.7408,
    "long": 6.4587
  },
  {
    "zipCode": 1358,
    "city": "Valeyres-sous-Rances",
    "lat": 46.753,
    "long": 6.5262
  },
  {
    "zipCode": 1372,
    "city": "Bavois",
    "lat": 46.684,
    "long": 6.5671
  },
  {
    "zipCode": 1373,
    "city": "Chavornay",
    "lat": 46.7024,
    "long": 6.5694
  },
  {
    "zipCode": 1374,
    "city": "Corcelles-sur-Chavornay",
    "lat": 46.7065,
    "long": 6.569
  },
  {
    "zipCode": 1375,
    "city": "Penthéréaz",
    "lat": 46.6817,
    "long": 6.6039
  },
  {
    "zipCode": 1376,
    "city": "Eclagnens",
    "lat": 46.6513,
    "long": 6.5919
  },
  {
    "zipCode": 1376,
    "city": "Goumoens-la-Ville",
    "lat": 46.6592,
    "long": 6.604
  },
  {
    "zipCode": 1376,
    "city": "Goumoens-le-Jux",
    "lat": 46.6552,
    "long": 6.5979
  },
  {
    "zipCode": 1377,
    "city": "Oulens-sous-Echallens",
    "lat": 46.6438,
    "long": 6.577
  },
  {
    "zipCode": 1400,
    "city": "Yverdon-les-Bains",
    "lat": 46.7785,
    "long": 6.6411
  },
  {
    "zipCode": 1401,
    "city": "Yverdon-les-Bains",
    "lat": 46.7743,
    "long": 6.6371
  },
  {
    "zipCode": 1404,
    "city": "Cuarny",
    "lat": 46.7699,
    "long": 6.6921
  },
  {
    "zipCode": 1404,
    "city": "Villars-Epeney",
    "lat": 46.7826,
    "long": 6.6976
  },
  {
    "zipCode": 1405,
    "city": "Pomy",
    "lat": 46.7586,
    "long": 6.6691
  },
  {
    "zipCode": 1406,
    "city": "Cronay",
    "lat": 46.7566,
    "long": 6.6977
  },
  {
    "zipCode": 1407,
    "city": "Donneloye",
    "lat": 46.7455,
    "long": 6.7164
  },
  {
    "zipCode": 1407,
    "city": "Gossens",
    "lat": 46.7393,
    "long": 6.7003
  },
  {
    "zipCode": 1407,
    "city": "Mézery-près-Donneloye",
    "lat": 46.7369,
    "long": 6.7092
  },
  {
    "zipCode": 1407,
    "city": "Bioley-Magnoux",
    "lat": 46.7259,
    "long": 6.7108
  },
  {
    "zipCode": 1408,
    "city": "Prahins",
    "lat": 46.7348,
    "long": 6.7386
  },
  {
    "zipCode": 1409,
    "city": "Chanéaz",
    "lat": 46.7288,
    "long": 6.7448
  },
  {
    "zipCode": 1410,
    "city": "Prévondavaux",
    "lat": 46.7296,
    "long": 6.7956
  },
  {
    "zipCode": 1410,
    "city": "Thierrens",
    "lat": 46.7038,
    "long": 6.755
  },
  {
    "zipCode": 1410,
    "city": "Denezy",
    "lat": 46.7215,
    "long": 6.7818
  },
  {
    "zipCode": 1410,
    "city": "St-Cierges",
    "lat": 46.6894,
    "long": 6.7354
  },
  {
    "zipCode": 1410,
    "city": "Correvon",
    "lat": 46.7171,
    "long": 6.7396
  },
  {
    "zipCode": 1412,
    "city": "Valeyres-sous-Ursins",
    "lat": 46.7471,
    "long": 6.6523
  },
  {
    "zipCode": 1412,
    "city": "Ursins",
    "lat": 46.7373,
    "long": 6.6682
  },
  {
    "zipCode": 1413,
    "city": "Orzens",
    "lat": 46.7263,
    "long": 6.683
  },
  {
    "zipCode": 1415,
    "city": "Démoret",
    "lat": 46.7469,
    "long": 6.7609
  },
  {
    "zipCode": 1415,
    "city": "Molondin",
    "lat": 46.7591,
    "long": 6.7446
  },
  {
    "zipCode": 1416,
    "city": "Pailly",
    "lat": 46.7012,
    "long": 6.6754
  },
  {
    "zipCode": 1417,
    "city": "Epautheyres",
    "lat": 46.7394,
    "long": 6.6426
  },
  {
    "zipCode": 1417,
    "city": "Essertines-sur-Yverdon",
    "lat": 46.7183,
    "long": 6.6384
  },
  {
    "zipCode": 1418,
    "city": "Vuarrens",
    "lat": 46.6858,
    "long": 6.6479
  },
  {
    "zipCode": 1420,
    "city": "Fiez",
    "lat": 46.8282,
    "long": 6.6239
  },
  {
    "zipCode": 1421,
    "city": "Grandevent",
    "lat": 46.8389,
    "long": 6.6066
  },
  {
    "zipCode": 1421,
    "city": "Fontaines-sur-Grandson",
    "lat": 46.8282,
    "long": 6.6239
  },
  {
    "zipCode": 1422,
    "city": "Grandson",
    "lat": 46.8095,
    "long": 6.646
  },
  {
    "zipCode": 1423,
    "city": "Romairon",
    "lat": 46.8502,
    "long": 6.6425
  },
  {
    "zipCode": 1423,
    "city": "Villars-Burquin",
    "lat": 46.8488,
    "long": 6.6276
  },
  {
    "zipCode": 1423,
    "city": "Fontanezier",
    "lat": 46.8547,
    "long": 6.6559
  },
  {
    "zipCode": 1423,
    "city": "Vaugondry",
    "lat": 46.8461,
    "long": 6.6364
  },
  {
    "zipCode": 1424,
    "city": "Champagne",
    "lat": 46.8321,
    "long": 6.6598
  },
  {
    "zipCode": 1425,
    "city": "Onnens VD",
    "lat": 46.8389,
    "long": 6.689
  },
  {
    "zipCode": 1426,
    "city": "Concise",
    "lat": 46.8503,
    "long": 6.7197
  },
  {
    "zipCode": 1426,
    "city": "Corcelles-près-Concise",
    "lat": 46.8518,
    "long": 6.7027
  },
  {
    "zipCode": 1427,
    "city": "Bonvillars",
    "lat": 46.8398,
    "long": 6.6713
  },
  {
    "zipCode": 1428,
    "city": "Mutrux",
    "lat": 46.8808,
    "long": 6.7266
  },
  {
    "zipCode": 1428,
    "city": "Provence",
    "lat": 46.8905,
    "long": 6.7261
  },
  {
    "zipCode": 1429,
    "city": "Giez",
    "lat": 46.816,
    "long": 6.6171
  },
  {
    "zipCode": 1430,
    "city": "Orges",
    "lat": 46.8093,
    "long": 6.5835
  },
  {
    "zipCode": 1431,
    "city": "Vugelles-La Mothe",
    "lat": 46.825,
    "long": 6.5738
  },
  {
    "zipCode": 1431,
    "city": "Novalles",
    "lat": 46.8284,
    "long": 6.5951
  },
  {
    "zipCode": 1432,
    "city": "Belmont-sur-Yverdon",
    "lat": 46.7418,
    "long": 6.6247
  },
  {
    "zipCode": 1432,
    "city": "Gressy",
    "lat": 46.7502,
    "long": 6.6364
  },
  {
    "zipCode": 1433,
    "city": "Suchy",
    "lat": 46.7235,
    "long": 6.5993
  },
  {
    "zipCode": 1434,
    "city": "Ependes VD",
    "lat": 46.7428,
    "long": 6.6081
  },
  {
    "zipCode": 1435,
    "city": "Essert-Pittet",
    "lat": 46.7065,
    "long": 6.569
  },
  {
    "zipCode": 1436,
    "city": "Chamblon",
    "lat": 46.7791,
    "long": 6.6026
  },
  {
    "zipCode": 1436,
    "city": "Treycovagnes",
    "lat": 46.7739,
    "long": 6.6124
  },
  {
    "zipCode": 1437,
    "city": "Suscévaz",
    "lat": 46.7622,
    "long": 6.5868
  },
  {
    "zipCode": 1438,
    "city": "Mathod",
    "lat": 46.7664,
    "long": 6.5647
  },
  {
    "zipCode": 1439,
    "city": "Rances",
    "lat": 46.7607,
    "long": 6.5297
  },
  {
    "zipCode": 1440,
    "city": "Montagny-Chamard",
    "lat": 46.7904,
    "long": 6.6098
  },
  {
    "zipCode": 1441,
    "city": "Valeyres-sous-Montagny",
    "lat": 46.8005,
    "long": 6.6037
  },
  {
    "zipCode": 1442,
    "city": "Montagny-près-Yverdon",
    "lat": 46.7929,
    "long": 6.6122
  },
  {
    "zipCode": 1443,
    "city": "Champvent",
    "lat": 46.7829,
    "long": 6.5719
  },
  {
    "zipCode": 1443,
    "city": "Essert-sous-Champvent",
    "lat": 46.7829,
    "long": 6.5719
  },
  {
    "zipCode": 1443,
    "city": "Villars-sous-Champvent",
    "lat": 46.7829,
    "long": 6.5719
  },
  {
    "zipCode": 1445,
    "city": "Vuiteboeuf",
    "lat": 46.8092,
    "long": 6.5504
  },
  {
    "zipCode": 1446,
    "city": "Baulmes",
    "lat": 46.7903,
    "long": 6.5228
  },
  {
    "zipCode": 1450,
    "city": "La Sagne (Ste-Croix)",
    "lat": 46.8165,
    "long": 6.4982
  },
  {
    "zipCode": 1450,
    "city": "Le Château-de-Ste-Croix",
    "lat": 46.8182,
    "long": 6.5341
  },
  {
    "zipCode": 1450,
    "city": "Ste-Croix",
    "lat": 46.8174,
    "long": 6.5161
  },
  {
    "zipCode": 1452,
    "city": "Les Rasses",
    "lat": 46.829,
    "long": 6.5391
  },
  {
    "zipCode": 1453,
    "city": "Bullet",
    "lat": 46.8312,
    "long": 6.554
  },
  {
    "zipCode": 1453,
    "city": "Mauborget",
    "lat": 46.8561,
    "long": 6.6156
  },
  {
    "zipCode": 1454,
    "city": "L'Auberson",
    "lat": 46.8192,
    "long": 6.4597
  },
  {
    "zipCode": 1454,
    "city": "La Vraconnaz",
    "lat": 46.8426,
    "long": 6.4837
  },
  {
    "zipCode": 1462,
    "city": "Yvonand",
    "lat": 46.8003,
    "long": 6.7425
  },
  {
    "zipCode": 1463,
    "city": "Rovray",
    "lat": 46.7849,
    "long": 6.7644
  },
  {
    "zipCode": 1464,
    "city": "Chavannes-le-Chêne",
    "lat": 46.777,
    "long": 6.7779
  },
  {
    "zipCode": 1464,
    "city": "Chêne-Pâquier",
    "lat": 46.7715,
    "long": 6.7694
  },
  {
    "zipCode": 1468,
    "city": "Cheyres",
    "lat": 46.8144,
    "long": 6.7868
  },
  {
    "zipCode": 1470,
    "city": "Seiry",
    "lat": 46.8141,
    "long": 6.8313
  },
  {
    "zipCode": 1470,
    "city": "Lully FR",
    "lat": 46.834,
    "long": 6.8453
  },
  {
    "zipCode": 1470,
    "city": "Bollion",
    "lat": 46.8192,
    "long": 6.828
  },
  {
    "zipCode": 1470,
    "city": "Estavayer-le-Lac",
    "lat": 46.8488,
    "long": 6.8465
  },
  {
    "zipCode": 1473,
    "city": "Châtillon FR",
    "lat": 46.8305,
    "long": 6.8315
  },
  {
    "zipCode": 1473,
    "city": "Font",
    "lat": 46.8375,
    "long": 6.8221
  },
  {
    "zipCode": 1474,
    "city": "Châbles FR",
    "lat": 46.8245,
    "long": 6.8108
  },
  {
    "zipCode": 1475,
    "city": "Forel FR",
    "lat": 46.8774,
    "long": 6.8891
  },
  {
    "zipCode": 1475,
    "city": "Montbrelloz",
    "lat": 46.8548,
    "long": 6.8876
  },
  {
    "zipCode": 1475,
    "city": "Autavaux",
    "lat": 46.8666,
    "long": 6.8782
  },
  {
    "zipCode": 1482,
    "city": "Cugy FR",
    "lat": 46.8148,
    "long": 6.8889
  },
  {
    "zipCode": 1483,
    "city": "Vesin",
    "lat": 46.8105,
    "long": 6.8752
  },
  {
    "zipCode": 1483,
    "city": "Frasses",
    "lat": 46.8282,
    "long": 6.8644
  },
  {
    "zipCode": 1483,
    "city": "Montet (Broye)",
    "lat": 46.8177,
    "long": 6.8679
  },
  {
    "zipCode": 1484,
    "city": "Granges-de-Vesin",
    "lat": 46.7989,
    "long": 6.8503
  },
  {
    "zipCode": 1484,
    "city": "Aumont",
    "lat": 46.7989,
    "long": 6.8503
  },
  {
    "zipCode": 1485,
    "city": "Nuvilly",
    "lat": 46.7834,
    "long": 6.8278
  },
  {
    "zipCode": 1486,
    "city": "Vuissens",
    "lat": 46.7334,
    "long": 6.7662
  },
  {
    "zipCode": 1489,
    "city": "Murist",
    "lat": 46.7902,
    "long": 6.8071
  },
  {
    "zipCode": 1509,
    "city": "Vucherens",
    "lat": 46.627,
    "long": 6.7758
  },
  {
    "zipCode": 1510,
    "city": "Moudon",
    "lat": 46.6676,
    "long": 6.7978
  },
  {
    "zipCode": 1510,
    "city": "Syens",
    "lat": 46.6441,
    "long": 6.7769
  },
  {
    "zipCode": 1512,
    "city": "Chavannes-sur-Moudon",
    "lat": 46.6587,
    "long": 6.8096
  },
  {
    "zipCode": 1513,
    "city": "Hermenches",
    "lat": 46.6403,
    "long": 6.7627
  },
  {
    "zipCode": 1513,
    "city": "Rossenges",
    "lat": 46.6535,
    "long": 6.776
  },
  {
    "zipCode": 1514,
    "city": "Bussy-sur-Moudon",
    "lat": 46.6905,
    "long": 6.8096
  },
  {
    "zipCode": 1515,
    "city": "Villars-le-Comte",
    "lat": 46.7131,
    "long": 6.8014
  },
  {
    "zipCode": 1515,
    "city": "Neyruz-sur-Moudon",
    "lat": 46.6503,
    "long": 6.6536
  },
  {
    "zipCode": 1521,
    "city": "Curtilles",
    "lat": 46.7004,
    "long": 6.8506
  },
  {
    "zipCode": 1522,
    "city": "Lucens",
    "lat": 46.7085,
    "long": 6.8393
  },
  {
    "zipCode": 1522,
    "city": "Oulens-sur-Lucens",
    "lat": 46.7085,
    "long": 6.8393
  },
  {
    "zipCode": 1523,
    "city": "Granges-près-Marnand",
    "lat": 46.7765,
    "long": 6.8959
  },
  {
    "zipCode": 1524,
    "city": "Marnand",
    "lat": 46.7573,
    "long": 6.8991
  },
  {
    "zipCode": 1525,
    "city": "Henniez",
    "lat": 46.7422,
    "long": 6.887
  },
  {
    "zipCode": 1525,
    "city": "Seigneux",
    "lat": 46.7276,
    "long": 6.8822
  },
  {
    "zipCode": 1526,
    "city": "Cremin",
    "lat": 46.7089,
    "long": 6.8326
  },
  {
    "zipCode": 1526,
    "city": "Forel-sur-Lucens",
    "lat": 46.7089,
    "long": 6.8326
  },
  {
    "zipCode": 1527,
    "city": "Villeneuve FR",
    "lat": 46.7421,
    "long": 6.8498
  },
  {
    "zipCode": 1528,
    "city": "Praratoud",
    "lat": 46.7353,
    "long": 6.8489
  },
  {
    "zipCode": 1528,
    "city": "Surpierre",
    "lat": 46.7421,
    "long": 6.8498
  },
  {
    "zipCode": 1529,
    "city": "Cheiry",
    "lat": 46.7504,
    "long": 6.8355
  },
  {
    "zipCode": 1530,
    "city": "Payerne",
    "lat": 46.8219,
    "long": 6.9382
  },
  {
    "zipCode": 1532,
    "city": "Fétigny",
    "lat": 46.7982,
    "long": 6.9117
  },
  {
    "zipCode": 1533,
    "city": "Ménières",
    "lat": 46.7827,
    "long": 6.8801
  },
  {
    "zipCode": 1534,
    "city": "Chapelle (Broye)",
    "lat": 46.7714,
    "long": 6.8524
  },
  {
    "zipCode": 1534,
    "city": "Sassel",
    "lat": 46.777,
    "long": 6.8571
  },
  {
    "zipCode": 1535,
    "city": "Combremont-le-Grand",
    "lat": 46.7617,
    "long": 6.8182
  },
  {
    "zipCode": 1536,
    "city": "Combremont-le-Petit",
    "lat": 46.7494,
    "long": 6.8093
  },
  {
    "zipCode": 1537,
    "city": "Champtauroz",
    "lat": 46.759,
    "long": 6.7863
  },
  {
    "zipCode": 1538,
    "city": "Treytorrens (Payerne)",
    "lat": 46.7722,
    "long": 6.8048
  },
  {
    "zipCode": 1541,
    "city": "Morens FR",
    "lat": 46.8436,
    "long": 6.907
  },
  {
    "zipCode": 1541,
    "city": "Sévaz",
    "lat": 46.8398,
    "long": 6.877
  },
  {
    "zipCode": 1541,
    "city": "Bussy FR",
    "lat": 46.8354,
    "long": 6.8886
  },
  {
    "zipCode": 1542,
    "city": "Rueyres-les-Prés",
    "lat": 46.857,
    "long": 6.9111
  },
  {
    "zipCode": 1543,
    "city": "Grandcour",
    "lat": 46.8719,
    "long": 6.9284
  },
  {
    "zipCode": 1544,
    "city": "Gletterens",
    "lat": 46.8949,
    "long": 6.9369
  },
  {
    "zipCode": 1545,
    "city": "Chevroux",
    "lat": 46.8884,
    "long": 6.9069
  },
  {
    "zipCode": 1551,
    "city": "Vers-chez-Perrin",
    "lat": 46.7977,
    "long": 6.9436
  },
  {
    "zipCode": 1552,
    "city": "Trey",
    "lat": 46.7702,
    "long": 6.9265
  },
  {
    "zipCode": 1553,
    "city": "Châtonnaye",
    "lat": 46.7545,
    "long": 6.938
  },
  {
    "zipCode": 1554,
    "city": "Sédeilles",
    "lat": 46.7486,
    "long": 6.9331
  },
  {
    "zipCode": 1554,
    "city": "Rossens VD",
    "lat": 46.7343,
    "long": 6.9247
  },
  {
    "zipCode": 1555,
    "city": "Villarzel",
    "lat": 46.7476,
    "long": 6.9122
  },
  {
    "zipCode": 1562,
    "city": "Corcelles-près-Payerne",
    "lat": 46.8332,
    "long": 6.9623
  },
  {
    "zipCode": 1563,
    "city": "Dompierre FR",
    "lat": 46.8521,
    "long": 6.9907
  },
  {
    "zipCode": 1564,
    "city": "Domdidier",
    "lat": 46.8672,
    "long": 7.0134
  },
  {
    "zipCode": 1565,
    "city": "Vallon",
    "lat": 46.8838,
    "long": 6.9554
  },
  {
    "zipCode": 1565,
    "city": "Missy",
    "lat": 46.8801,
    "long": 6.973
  },
  {
    "zipCode": 1566,
    "city": "St-Aubin FR",
    "lat": 46.89,
    "long": 6.9805
  },
  {
    "zipCode": 1566,
    "city": "Les Friques",
    "lat": 46.9043,
    "long": 6.9872
  },
  {
    "zipCode": 1567,
    "city": "Delley",
    "lat": 46.9198,
    "long": 6.9577
  },
  {
    "zipCode": 1568,
    "city": "Portalban",
    "lat": 46.9189,
    "long": 6.9563
  },
  {
    "zipCode": 1580,
    "city": "Oleyres",
    "lat": 46.8545,
    "long": 7.0379
  },
  {
    "zipCode": 1580,
    "city": "Avenches",
    "lat": 46.88,
    "long": 7.0407
  },
  {
    "zipCode": 1580,
    "city": "Donatyre",
    "lat": 46.8673,
    "long": 7.0393
  },
  {
    "zipCode": 1583,
    "city": "Villarepos",
    "lat": 46.8643,
    "long": 7.1264
  },
  {
    "zipCode": 1584,
    "city": "Villars-le-Grand",
    "lat": 46.9049,
    "long": 6.99
  },
  {
    "zipCode": 1585,
    "city": "Cotterd",
    "lat": 46.9209,
    "long": 7.0224
  },
  {
    "zipCode": 1585,
    "city": "Bellerive VD",
    "lat": 46.9234,
    "long": 7.0221
  },
  {
    "zipCode": 1585,
    "city": "Salavaux",
    "lat": 46.9197,
    "long": 7.0232
  },
  {
    "zipCode": 1586,
    "city": "Vallamand",
    "lat": 46.9293,
    "long": 7.0403
  },
  {
    "zipCode": 1587,
    "city": "Constantine",
    "lat": 46.9183,
    "long": 7.0086
  },
  {
    "zipCode": 1587,
    "city": "Montmagny",
    "lat": 46.9272,
    "long": 7.0075
  },
  {
    "zipCode": 1588,
    "city": "Cudrefin",
    "lat": 46.9558,
    "long": 7.0185
  },
  {
    "zipCode": 1589,
    "city": "Chabrey",
    "lat": 46.9269,
    "long": 6.9816
  },
  {
    "zipCode": 1595,
    "city": "Clavaleyres",
    "lat": 46.8991,
    "long": 7.0928
  },
  {
    "zipCode": 1595,
    "city": "Faoug",
    "lat": 46.9083,
    "long": 7.078
  },
  {
    "zipCode": 1607,
    "city": "Palézieux-Village",
    "lat": 46.5553,
    "long": 6.8311
  },
  {
    "zipCode": 1607,
    "city": "Les Tavernes",
    "lat": 46.5548,
    "long": 6.8106
  },
  {
    "zipCode": 1607,
    "city": "Palézieux",
    "lat": 46.5419,
    "long": 6.8399
  },
  {
    "zipCode": 1607,
    "city": "Les Thioleyres",
    "lat": 46.5389,
    "long": 6.8114
  },
  {
    "zipCode": 1608,
    "city": "Chapelle (Glâne)",
    "lat": 46.5887,
    "long": 6.8372
  },
  {
    "zipCode": 1608,
    "city": "Chesalles-sur-Oron",
    "lat": 46.5775,
    "long": 6.8558
  },
  {
    "zipCode": 1608,
    "city": "Oron-le-Châtel",
    "lat": 46.573,
    "long": 6.8404
  },
  {
    "zipCode": 1608,
    "city": "Bussigny-sur-Oron",
    "lat": 46.5698,
    "long": 6.8648
  },
  {
    "zipCode": 1609,
    "city": "Besencens",
    "lat": 46.5875,
    "long": 6.8687
  },
  {
    "zipCode": 1609,
    "city": "St-Martin FR",
    "lat": 46.5763,
    "long": 6.8698
  },
  {
    "zipCode": 1609,
    "city": "Fiaugères",
    "lat": 46.5873,
    "long": 6.8927
  },
  {
    "zipCode": 1609,
    "city": "Fiaugères",
    "lat": 46.5873,
    "long": 6.8927
  },
  {
    "zipCode": 1610,
    "city": "Oron-la-Ville",
    "lat": 46.5709,
    "long": 6.8256
  },
  {
    "zipCode": 1610,
    "city": "Vuibroye",
    "lat": 46.5714,
    "long": 6.8047
  },
  {
    "zipCode": 1610,
    "city": "Châtillens",
    "lat": 46.5647,
    "long": 6.8128
  },
  {
    "zipCode": 1611,
    "city": "Le Crêt-près-Semsales",
    "lat": 46.609,
    "long": 6.9097
  },
  {
    "zipCode": 1612,
    "city": "Ecoteaux",
    "lat": 46.5469,
    "long": 6.8641
  },
  {
    "zipCode": 1613,
    "city": "Maracon",
    "lat": 46.5501,
    "long": 6.8722
  },
  {
    "zipCode": 1614,
    "city": "Granges (Veveyse)",
    "lat": 46.5261,
    "long": 6.83
  },
  {
    "zipCode": 1615,
    "city": "Bossonnens",
    "lat": 46.5285,
    "long": 6.8525
  },
  {
    "zipCode": 1616,
    "city": "Attalens",
    "lat": 46.5056,
    "long": 6.8504
  },
  {
    "zipCode": 1617,
    "city": "Tatroz",
    "lat": 46.527,
    "long": 6.8669
  },
  {
    "zipCode": 1617,
    "city": "Remaufens",
    "lat": 46.5287,
    "long": 6.8826
  },
  {
    "zipCode": 1618,
    "city": "Châtel-St-Denis",
    "lat": 46.5269,
    "long": 6.9008
  },
  {
    "zipCode": 1619,
    "city": "Les Paccots",
    "lat": 46.5241,
    "long": 6.9463
  },
  {
    "zipCode": 1623,
    "city": "Semsales",
    "lat": 46.5732,
    "long": 6.9295
  },
  {
    "zipCode": 1624,
    "city": "La Verrerie",
    "lat": 46.5995,
    "long": 6.9203
  },
  {
    "zipCode": 1624,
    "city": "Progens",
    "lat": 46.5848,
    "long": 6.9111
  },
  {
    "zipCode": 1624,
    "city": "Progens",
    "lat": 46.5699,
    "long": 6.9557
  },
  {
    "zipCode": 1624,
    "city": "Grattavache",
    "lat": 46.596,
    "long": 6.9134
  },
  {
    "zipCode": 1625,
    "city": "Sâles (Gruyère)",
    "lat": 46.6347,
    "long": 6.9734
  },
  {
    "zipCode": 1625,
    "city": "Maules",
    "lat": 46.64,
    "long": 6.9921
  },
  {
    "zipCode": 1626,
    "city": "Treyfayes",
    "lat": 46.6541,
    "long": 6.9533
  },
  {
    "zipCode": 1626,
    "city": "Rueyres-Treyfayes",
    "lat": 46.653,
    "long": 6.9623
  },
  {
    "zipCode": 1626,
    "city": "Romanens",
    "lat": 46.652,
    "long": 6.9714
  },
  {
    "zipCode": 1627,
    "city": "Vaulruz",
    "lat": 46.6216,
    "long": 6.9882
  },
  {
    "zipCode": 1628,
    "city": "Vuadens",
    "lat": 46.6155,
    "long": 7.0173
  },
  {
    "zipCode": 1630,
    "city": "Bulle",
    "lat": 46.618,
    "long": 7.0569
  },
  {
    "zipCode": 1632,
    "city": "Riaz",
    "lat": 46.6422,
    "long": 7.0618
  },
  {
    "zipCode": 1633,
    "city": "Vuippens",
    "lat": 46.66,
    "long": 7.0746
  },
  {
    "zipCode": 1633,
    "city": "Marsens",
    "lat": 46.6564,
    "long": 7.0595
  },
  {
    "zipCode": 1634,
    "city": "La Roche FR",
    "lat": 46.6962,
    "long": 7.1372
  },
  {
    "zipCode": 1635,
    "city": "La Tour-de-Trême",
    "lat": 46.6106,
    "long": 7.065
  },
  {
    "zipCode": 1636,
    "city": "Broc",
    "lat": 46.6051,
    "long": 7.0989
  },
  {
    "zipCode": 1637,
    "city": "Charmey (Gruyère)",
    "lat": 46.6196,
    "long": 7.1649
  },
  {
    "zipCode": 1638,
    "city": "Morlon",
    "lat": 46.6256,
    "long": 7.0838
  },
  {
    "zipCode": 1642,
    "city": "Sorens",
    "lat": 46.6691,
    "long": 7.0525
  },
  {
    "zipCode": 1643,
    "city": "Gumefens",
    "lat": 46.6779,
    "long": 7.0766
  },
  {
    "zipCode": 1644,
    "city": "Avry-devant-Pont",
    "lat": 46.6871,
    "long": 7.0876
  },
  {
    "zipCode": 1645,
    "city": "Le Bry",
    "lat": 46.7046,
    "long": 7.0825
  },
  {
    "zipCode": 1646,
    "city": "Echarlens",
    "lat": 46.6478,
    "long": 7.0742
  },
  {
    "zipCode": 1647,
    "city": "Corbières",
    "lat": 46.6595,
    "long": 7.101
  },
  {
    "zipCode": 1648,
    "city": "Hauteville",
    "lat": 46.6701,
    "long": 7.1104
  },
  {
    "zipCode": 1649,
    "city": "Pont-la-Ville",
    "lat": 46.7,
    "long": 7.1
  },
  {
    "zipCode": 1651,
    "city": "Villarvolard",
    "lat": 46.6453,
    "long": 7.1074
  },
  {
    "zipCode": 1652,
    "city": "Villarbeney",
    "lat": 46.6302,
    "long": 7.1095
  },
  {
    "zipCode": 1652,
    "city": "Botterens",
    "lat": 46.616,
    "long": 7.1117
  },
  {
    "zipCode": 1653,
    "city": "Châtel-sur-Montsalvens",
    "lat": 46.6165,
    "long": 7.1327
  },
  {
    "zipCode": 1653,
    "city": "Crésuz",
    "lat": 46.6206,
    "long": 7.1426
  },
  {
    "zipCode": 1654,
    "city": "Cerniat FR",
    "lat": 46.6333,
    "long": 7.1573
  },
  {
    "zipCode": 1656,
    "city": "Jaun",
    "lat": 46.6113,
    "long": 7.2759
  },
  {
    "zipCode": 1656,
    "city": "Im Fang",
    "lat": 46.5988,
    "long": 7.2362
  },
  {
    "zipCode": 1657,
    "city": "Abländschen",
    "lat": 46.5724,
    "long": 7.2892
  },
  {
    "zipCode": 1658,
    "city": "La Tine",
    "lat": 46.4696,
    "long": 7.0522
  },
  {
    "zipCode": 1658,
    "city": "Rossinière",
    "lat": 46.4676,
    "long": 7.0837
  },
  {
    "zipCode": 1659,
    "city": "Rougemont",
    "lat": 46.4881,
    "long": 7.2066
  },
  {
    "zipCode": 1659,
    "city": "Flendruz",
    "lat": 46.4851,
    "long": 7.1827
  },
  {
    "zipCode": 1660,
    "city": "La Lécherette",
    "lat": 46.4199,
    "long": 7.1073
  },
  {
    "zipCode": 1660,
    "city": "Les Moulins",
    "lat": 46.4619,
    "long": 7.1051
  },
  {
    "zipCode": 1660,
    "city": "L'Etivaz",
    "lat": 46.4248,
    "long": 7.1462
  },
  {
    "zipCode": 1660,
    "city": "Château-d'Oex",
    "lat": 46.4745,
    "long": 7.1316
  },
  {
    "zipCode": 1661,
    "city": "Le Pâquier-Montbarry",
    "lat": 46.5948,
    "long": 7.0533
  },
  {
    "zipCode": 1663,
    "city": "Gruyères",
    "lat": 46.5834,
    "long": 7.0821
  },
  {
    "zipCode": 1663,
    "city": "Moléson-sur-Gruyères",
    "lat": 46.5851,
    "long": 7.0803
  },
  {
    "zipCode": 1663,
    "city": "Pringy",
    "lat": 46.5823,
    "long": 7.0733
  },
  {
    "zipCode": 1663,
    "city": "Epagny",
    "lat": 46.5896,
    "long": 7.0856
  },
  {
    "zipCode": 1665,
    "city": "Estavannens",
    "lat": 46.5605,
    "long": 7.1019
  },
  {
    "zipCode": 1666,
    "city": "Villars-sous-Mont",
    "lat": 46.5412,
    "long": 7.0704
  },
  {
    "zipCode": 1666,
    "city": "Grandvillard",
    "lat": 46.539,
    "long": 7.0857
  },
  {
    "zipCode": 1667,
    "city": "Enney",
    "lat": 46.5667,
    "long": 7.0842
  },
  {
    "zipCode": 1669,
    "city": "Neirivue",
    "lat": 46.525,
    "long": 7.0582
  },
  {
    "zipCode": 1669,
    "city": "Les Sciernes-d'Albeuve",
    "lat": 46.4958,
    "long": 7.0337
  },
  {
    "zipCode": 1669,
    "city": "Lessoc",
    "lat": 46.5048,
    "long": 7.0621
  },
  {
    "zipCode": 1669,
    "city": "Albeuve",
    "lat": 46.5173,
    "long": 7.0567
  },
  {
    "zipCode": 1669,
    "city": "Montbovon",
    "lat": 46.4882,
    "long": 7.0437
  },
  {
    "zipCode": 1670,
    "city": "Esmonts",
    "lat": 46.6432,
    "long": 6.8451
  },
  {
    "zipCode": 1670,
    "city": "Ursy",
    "lat": 46.6335,
    "long": 6.8371
  },
  {
    "zipCode": 1670,
    "city": "Bionnens",
    "lat": 46.6351,
    "long": 6.8555
  },
  {
    "zipCode": 1673,
    "city": "Auboranges",
    "lat": 46.5846,
    "long": 6.8045
  },
  {
    "zipCode": 1673,
    "city": "Gillarens",
    "lat": 46.5889,
    "long": 6.8281
  },
  {
    "zipCode": 1673,
    "city": "Promasens",
    "lat": 46.6028,
    "long": 6.8238
  },
  {
    "zipCode": 1673,
    "city": "Rue",
    "lat": 46.6192,
    "long": 6.8223
  },
  {
    "zipCode": 1673,
    "city": "Ecublens FR",
    "lat": 46.6074,
    "long": 6.8089
  },
  {
    "zipCode": 1674,
    "city": "Montet (Glâne)",
    "lat": 46.6413,
    "long": 6.813
  },
  {
    "zipCode": 1674,
    "city": "Morlens",
    "lat": 46.6542,
    "long": 6.8374
  },
  {
    "zipCode": 1674,
    "city": "Vuarmarens",
    "lat": 46.6478,
    "long": 6.8287
  },
  {
    "zipCode": 1675,
    "city": "Vauderens",
    "lat": 46.6228,
    "long": 6.8507
  },
  {
    "zipCode": 1675,
    "city": "Mossel",
    "lat": 46.6086,
    "long": 6.8516
  },
  {
    "zipCode": 1675,
    "city": "Blessens",
    "lat": 46.612,
    "long": 6.8388
  },
  {
    "zipCode": 1676,
    "city": "Chavannes-les-Forts",
    "lat": 46.653,
    "long": 6.8985
  },
  {
    "zipCode": 1677,
    "city": "Prez-vers-Siviriez",
    "lat": 46.6397,
    "long": 6.8748
  },
  {
    "zipCode": 1678,
    "city": "Siviriez",
    "lat": 46.6585,
    "long": 6.8777
  },
  {
    "zipCode": 1679,
    "city": "Villaraboud",
    "lat": 46.6607,
    "long": 6.9135
  },
  {
    "zipCode": 1680,
    "city": "Romont FR",
    "lat": 46.6965,
    "long": 6.919
  },
  {
    "zipCode": 1680,
    "city": "Berlens",
    "lat": 46.6959,
    "long": 6.9541
  },
  {
    "zipCode": 1681,
    "city": "Hennens",
    "lat": 46.6837,
    "long": 6.8864
  },
  {
    "zipCode": 1681,
    "city": "Billens",
    "lat": 46.6922,
    "long": 6.9008
  },
  {
    "zipCode": 1682,
    "city": "Prévonloup",
    "lat": 46.6979,
    "long": 6.8828
  },
  {
    "zipCode": 1682,
    "city": "Lovatens",
    "lat": 46.692,
    "long": 6.8607
  },
  {
    "zipCode": 1682,
    "city": "Villars-Bramard",
    "lat": 46.7182,
    "long": 6.9031
  },
  {
    "zipCode": 1682,
    "city": "Cerniaz VD",
    "lat": 46.7279,
    "long": 6.8946
  },
  {
    "zipCode": 1682,
    "city": "Dompierre VD",
    "lat": 46.7083,
    "long": 6.8831
  },
  {
    "zipCode": 1683,
    "city": "Chesalles-sur-Moudon",
    "lat": 46.6762,
    "long": 6.8506
  },
  {
    "zipCode": 1683,
    "city": "Sarzens",
    "lat": 46.7089,
    "long": 6.8326
  },
  {
    "zipCode": 1683,
    "city": "Brenles",
    "lat": 46.7089,
    "long": 6.8326
  },
  {
    "zipCode": 1684,
    "city": "Mézières FR",
    "lat": 46.6796,
    "long": 6.9263
  },
  {
    "zipCode": 1685,
    "city": "Villariaz",
    "lat": 46.6662,
    "long": 6.9409
  },
  {
    "zipCode": 1686,
    "city": "Grangettes-près-Romont",
    "lat": 46.6717,
    "long": 6.9753
  },
  {
    "zipCode": 1686,
    "city": "La Neirigue",
    "lat": 46.683,
    "long": 6.9525
  },
  {
    "zipCode": 1687,
    "city": "La Magne",
    "lat": 46.6347,
    "long": 6.9323
  },
  {
    "zipCode": 1687,
    "city": "Estévenens",
    "lat": 46.6703,
    "long": 6.9551
  },
  {
    "zipCode": 1687,
    "city": "Vuisternens-devant-Romont",
    "lat": 46.6478,
    "long": 6.9411
  },
  {
    "zipCode": 1688,
    "city": "Lieffrens",
    "lat": 46.638,
    "long": 6.9017
  },
  {
    "zipCode": 1688,
    "city": "Sommentier",
    "lat": 46.6397,
    "long": 6.9131
  },
  {
    "zipCode": 1689,
    "city": "Le Châtelard-près-Romont",
    "lat": 46.6804,
    "long": 6.9792
  },
  {
    "zipCode": 1690,
    "city": "Villaz-St-Pierre",
    "lat": 46.7207,
    "long": 6.9564
  },
  {
    "zipCode": 1690,
    "city": "Lussy FR",
    "lat": 46.7173,
    "long": 6.948
  },
  {
    "zipCode": 1691,
    "city": "Villarimboud",
    "lat": 46.7417,
    "long": 6.9652
  },
  {
    "zipCode": 1692,
    "city": "Massonnens",
    "lat": 46.6966,
    "long": 6.9762
  },
  {
    "zipCode": 1694,
    "city": "Villargiroud",
    "lat": 46.7055,
    "long": 7.0022
  },
  {
    "zipCode": 1694,
    "city": "Orsonnens",
    "lat": 46.7157,
    "long": 6.995
  },
  {
    "zipCode": 1694,
    "city": "Villarsiviriaux",
    "lat": 46.6994,
    "long": 7.0103
  },
  {
    "zipCode": 1694,
    "city": "Chavannes-sous-Orsonnens",
    "lat": 46.7273,
    "long": 6.9917
  },
  {
    "zipCode": 1695,
    "city": "Villarsel-le-Gibloux",
    "lat": 46.713,
    "long": 7.0177
  },
  {
    "zipCode": 1695,
    "city": "Villarlod",
    "lat": 46.7066,
    "long": 7.0218
  },
  {
    "zipCode": 1695,
    "city": "Estavayer-le-Gibloux",
    "lat": 46.7241,
    "long": 7.0263
  },
  {
    "zipCode": 1695,
    "city": "Rueyres-St-Laurent",
    "lat": 46.7129,
    "long": 7.0361
  },
  {
    "zipCode": 1696,
    "city": "Vuisternens-en-Ogoz",
    "lat": 46.7081,
    "long": 7.054
  },
  {
    "zipCode": 1697,
    "city": "Les Ecasseys",
    "lat": 46.623,
    "long": 6.9108
  },
  {
    "zipCode": 1697,
    "city": "La Joux FR",
    "lat": 46.6306,
    "long": 6.9401
  },
  {
    "zipCode": 1699,
    "city": "Pont (Veveyse)",
    "lat": 46.5885,
    "long": 6.8513
  },
  {
    "zipCode": 1699,
    "city": "Porsel",
    "lat": 46.6015,
    "long": 6.8658
  },
  {
    "zipCode": 1699,
    "city": "Bouloz",
    "lat": 46.6124,
    "long": 6.8827
  },
  {
    "zipCode": 1699,
    "city": "Porsel",
    "lat": 46.6015,
    "long": 6.8658
  },
  {
    "zipCode": 1700,
    "city": "Fribourg",
    "lat": 46.8024,
    "long": 7.1513
  },
  {
    "zipCode": 1712,
    "city": "Tafers",
    "lat": 46.8148,
    "long": 7.2185
  },
  {
    "zipCode": 1713,
    "city": "St. Antoni",
    "lat": 46.8221,
    "long": 7.2609
  },
  {
    "zipCode": 1714,
    "city": "Heitenried",
    "lat": 46.8276,
    "long": 7.2994
  },
  {
    "zipCode": 1715,
    "city": "Alterswil FR",
    "lat": 46.7959,
    "long": 7.2588
  },
  {
    "zipCode": 1716,
    "city": "Plaffeien",
    "lat": 46.742,
    "long": 7.2867
  },
  {
    "zipCode": 1716,
    "city": "Schwarzsee",
    "lat": 46.671,
    "long": 7.2818
  },
  {
    "zipCode": 1716,
    "city": "Oberschrot",
    "lat": 46.7413,
    "long": 7.2815
  },
  {
    "zipCode": 1717,
    "city": "St. Ursen",
    "lat": 46.7869,
    "long": 7.2243
  },
  {
    "zipCode": 1718,
    "city": "Rechthalten",
    "lat": 46.7677,
    "long": 7.2403
  },
  {
    "zipCode": 1719,
    "city": "Zumholz",
    "lat": 46.6871,
    "long": 7.3155
  },
  {
    "zipCode": 1719,
    "city": "Brünisried",
    "lat": 46.7578,
    "long": 7.2785
  },
  {
    "zipCode": 1720,
    "city": "Corminboeuf",
    "lat": 46.8103,
    "long": 7.1054
  },
  {
    "zipCode": 1720,
    "city": "Chésopelloz",
    "lat": 46.8022,
    "long": 7.0963
  },
  {
    "zipCode": 1721,
    "city": "Cournillens",
    "lat": 46.8587,
    "long": 7.1026
  },
  {
    "zipCode": 1721,
    "city": "Misery",
    "lat": 46.8524,
    "long": 7.0639
  },
  {
    "zipCode": 1721,
    "city": "Cormérod",
    "lat": 46.8671,
    "long": 7.0896
  },
  {
    "zipCode": 1721,
    "city": "Courtion",
    "lat": 46.8572,
    "long": 7.0689
  },
  {
    "zipCode": 1722,
    "city": "Bourguillon",
    "lat": 46.8013,
    "long": 7.1777
  },
  {
    "zipCode": 1723,
    "city": "Marly",
    "lat": 46.7761,
    "long": 7.1646
  },
  {
    "zipCode": 1723,
    "city": "Pierrafortscha",
    "lat": 46.7748,
    "long": 7.1858
  },
  {
    "zipCode": 1723,
    "city": "Villarsel-sur-Marly",
    "lat": 46.7618,
    "long": 7.172
  },
  {
    "zipCode": 1724,
    "city": "Le Mouret",
    "lat": 46.7318,
    "long": 7.1875
  },
  {
    "zipCode": 1724,
    "city": "Montévraz",
    "lat": 46.7263,
    "long": 7.1759
  },
  {
    "zipCode": 1724,
    "city": "Bonnefontaine",
    "lat": 46.7414,
    "long": 7.2011
  },
  {
    "zipCode": 1724,
    "city": "Ferpicloz",
    "lat": 46.7482,
    "long": 7.1622
  },
  {
    "zipCode": 1724,
    "city": "Zénauva",
    "lat": 46.735,
    "long": 7.182
  },
  {
    "zipCode": 1724,
    "city": "Senèdes",
    "lat": 46.7418,
    "long": 7.1419
  },
  {
    "zipCode": 1724,
    "city": "Essert FR",
    "lat": 46.7392,
    "long": 7.1645
  },
  {
    "zipCode": 1724,
    "city": "Oberried FR",
    "lat": 46.7381,
    "long": 7.1867
  },
  {
    "zipCode": 1725,
    "city": "Posieux",
    "lat": 46.7623,
    "long": 7.0971
  },
  {
    "zipCode": 1726,
    "city": "Grenilles",
    "lat": 46.7285,
    "long": 7.0503
  },
  {
    "zipCode": 1726,
    "city": "Farvagny",
    "lat": 46.7277,
    "long": 7.0663
  },
  {
    "zipCode": 1726,
    "city": "Farvagny-le-Petit",
    "lat": 46.7287,
    "long": 7.0727
  },
  {
    "zipCode": 1726,
    "city": "Posat",
    "lat": 46.7389,
    "long": 7.0584
  },
  {
    "zipCode": 1727,
    "city": "Corpataux",
    "lat": 46.7433,
    "long": 7.0971
  },
  {
    "zipCode": 1727,
    "city": "Magnedens",
    "lat": 46.7435,
    "long": 7.0823
  },
  {
    "zipCode": 1728,
    "city": "Rossens FR",
    "lat": 46.7201,
    "long": 7.1034
  },
  {
    "zipCode": 1730,
    "city": "Ecuvillens",
    "lat": 46.7578,
    "long": 7.0828
  },
  {
    "zipCode": 1731,
    "city": "Ependes FR",
    "lat": 46.7537,
    "long": 7.1461
  },
  {
    "zipCode": 1732,
    "city": "Arconciel",
    "lat": 46.7473,
    "long": 7.1215
  },
  {
    "zipCode": 1733,
    "city": "Treyvaux",
    "lat": 46.728,
    "long": 7.1377
  },
  {
    "zipCode": 1734,
    "city": "Tentlingen",
    "lat": 46.7692,
    "long": 7.1977
  },
  {
    "zipCode": 1735,
    "city": "Giffers",
    "lat": 46.7623,
    "long": 7.2085
  },
  {
    "zipCode": 1736,
    "city": "St. Silvester",
    "lat": 46.7425,
    "long": 7.224
  },
  {
    "zipCode": 1737,
    "city": "Plasselb",
    "lat": 46.7349,
    "long": 7.2512
  },
  {
    "zipCode": 1738,
    "city": "Sangernboden",
    "lat": 46.7133,
    "long": 7.3519
  },
  {
    "zipCode": 1740,
    "city": "Neyruz FR",
    "lat": 46.7681,
    "long": 7.0669
  },
  {
    "zipCode": 1741,
    "city": "Cottens FR",
    "lat": 46.7522,
    "long": 7.0313
  },
  {
    "zipCode": 1742,
    "city": "Autigny",
    "lat": 46.7366,
    "long": 7.02
  },
  {
    "zipCode": 1744,
    "city": "Chénens",
    "lat": 46.7416,
    "long": 7.004
  },
  {
    "zipCode": 1745,
    "city": "Lentigny",
    "lat": 46.7611,
    "long": 7.0029
  },
  {
    "zipCode": 1746,
    "city": "Prez-vers-Noréaz",
    "lat": 46.7854,
    "long": 7.0158
  },
  {
    "zipCode": 1747,
    "city": "Corserey",
    "lat": 46.7731,
    "long": 6.9887
  },
  {
    "zipCode": 1748,
    "city": "Torny-le-Grand",
    "lat": 46.772,
    "long": 6.9667
  },
  {
    "zipCode": 1749,
    "city": "Middes",
    "lat": 46.7692,
    "long": 6.9502
  },
  {
    "zipCode": 1752,
    "city": "Villars-sur-Glâne",
    "lat": 46.7905,
    "long": 7.1172
  },
  {
    "zipCode": 1753,
    "city": "Matran",
    "lat": 46.7859,
    "long": 7.0977
  },
  {
    "zipCode": 1754,
    "city": "Avry-sur-Matran",
    "lat": 46.7875,
    "long": 7.0673
  },
  {
    "zipCode": 1754,
    "city": "Rosé",
    "lat": 46.784,
    "long": 7.0629
  },
  {
    "zipCode": 1754,
    "city": "Corjolens",
    "lat": 46.7869,
    "long": 7.0465
  },
  {
    "zipCode": 1756,
    "city": "Onnens FR",
    "lat": 46.7747,
    "long": 7.0371
  },
  {
    "zipCode": 1756,
    "city": "Lovens",
    "lat": 46.7741,
    "long": 7.0211
  },
  {
    "zipCode": 1757,
    "city": "Noréaz",
    "lat": 46.8015,
    "long": 7.0278
  },
  {
    "zipCode": 1762,
    "city": "Givisiez",
    "lat": 46.812,
    "long": 7.1264
  },
  {
    "zipCode": 1763,
    "city": "Granges-Paccot",
    "lat": 46.8267,
    "long": 7.1425
  },
  {
    "zipCode": 1772,
    "city": "Grolley",
    "lat": 46.8336,
    "long": 7.0712
  },
  {
    "zipCode": 1772,
    "city": "Nierlet-les-Bois",
    "lat": 46.8213,
    "long": 7.0585
  },
  {
    "zipCode": 1772,
    "city": "Ponthaux",
    "lat": 46.8153,
    "long": 7.0414
  },
  {
    "zipCode": 1773,
    "city": "Russy",
    "lat": 46.8413,
    "long": 7.0035
  },
  {
    "zipCode": 1773,
    "city": "Chandon",
    "lat": 46.8405,
    "long": 7.0489
  },
  {
    "zipCode": 1773,
    "city": "Léchelles",
    "lat": 46.829,
    "long": 7.0162
  },
  {
    "zipCode": 1774,
    "city": "Montagny-les-Monts",
    "lat": 46.8107,
    "long": 6.9915
  },
  {
    "zipCode": 1774,
    "city": "Cousset",
    "lat": 46.8192,
    "long": 6.9793
  },
  {
    "zipCode": 1774,
    "city": "Cousset",
    "lat": 46.8192,
    "long": 6.9793
  },
  {
    "zipCode": 1775,
    "city": "Grandsivaz",
    "lat": 46.785,
    "long": 6.9808
  },
  {
    "zipCode": 1775,
    "city": "Mannens",
    "lat": 46.7937,
    "long": 6.9689
  },
  {
    "zipCode": 1776,
    "city": "Montagny-la-Ville",
    "lat": 46.8175,
    "long": 6.9957
  },
  {
    "zipCode": 1782,
    "city": "Autafond",
    "lat": 46.8288,
    "long": 7.095
  },
  {
    "zipCode": 1782,
    "city": "Cormagens",
    "lat": 46.8359,
    "long": 7.1359
  },
  {
    "zipCode": 1782,
    "city": "Lossy",
    "lat": 46.8351,
    "long": 7.1095
  },
  {
    "zipCode": 1782,
    "city": "Belfaux",
    "lat": 46.8217,
    "long": 7.1067
  },
  {
    "zipCode": 1782,
    "city": "Formangueires",
    "lat": 46.8272,
    "long": 7.1166
  },
  {
    "zipCode": 1782,
    "city": "La Corbaz",
    "lat": 46.8404,
    "long": 7.1159
  },
  {
    "zipCode": 1783,
    "city": "Barberêche",
    "lat": 46.8643,
    "long": 7.1264
  },
  {
    "zipCode": 1783,
    "city": "Pensier",
    "lat": 46.8643,
    "long": 7.1264
  },
  {
    "zipCode": 1784,
    "city": "Courtepin",
    "lat": 46.8655,
    "long": 7.1231
  },
  {
    "zipCode": 1784,
    "city": "Wallenried",
    "lat": 46.8643,
    "long": 7.1264
  },
  {
    "zipCode": 1785,
    "city": "Cressier FR",
    "lat": 46.8979,
    "long": 7.1407
  },
  {
    "zipCode": 1786,
    "city": "Sugiez",
    "lat": 46.9619,
    "long": 7.1129
  },
  {
    "zipCode": 1787,
    "city": "Môtier (Vully)",
    "lat": 46.9495,
    "long": 7.084
  },
  {
    "zipCode": 1787,
    "city": "Mur (Vully) FR",
    "lat": 46.9461,
    "long": 7.0644
  },
  {
    "zipCode": 1787,
    "city": "Mur (Vully) VD",
    "lat": 46.7765,
    "long": 6.8959
  },
  {
    "zipCode": 1788,
    "city": "Praz (Vully)",
    "lat": 46.9531,
    "long": 7.098
  },
  {
    "zipCode": 1789,
    "city": "Lugnorre",
    "lat": 46.951,
    "long": 7.0749
  },
  {
    "zipCode": 1791,
    "city": "Courtaman",
    "lat": 46.8734,
    "long": 7.1316
  },
  {
    "zipCode": 1792,
    "city": "Guschelmuth",
    "lat": 46.8866,
    "long": 7.1433
  },
  {
    "zipCode": 1792,
    "city": "Cordast",
    "lat": 46.876,
    "long": 7.1521
  },
  {
    "zipCode": 1793,
    "city": "Jeuss",
    "lat": 46.9365,
    "long": 7.1412
  },
  {
    "zipCode": 1794,
    "city": "Salvenach",
    "lat": 46.9365,
    "long": 7.1412
  },
  {
    "zipCode": 1795,
    "city": "Courlevon",
    "lat": 46.9365,
    "long": 7.1412
  },
  {
    "zipCode": 1796,
    "city": "Courgevaux",
    "lat": 46.9065,
    "long": 7.1121
  },
  {
    "zipCode": 1797,
    "city": "Münchenwiler",
    "lat": 46.9133,
    "long": 7.1256
  },
  {
    "zipCode": 1800,
    "city": "Vevey",
    "lat": 46.463,
    "long": 6.8435
  },
  {
    "zipCode": 1801,
    "city": "Le Mont-Pèlerin",
    "lat": 46.4886,
    "long": 6.8216
  },
  {
    "zipCode": 1802,
    "city": "Corseaux",
    "lat": 46.4722,
    "long": 6.8294
  },
  {
    "zipCode": 1803,
    "city": "Chardonne",
    "lat": 46.4768,
    "long": 6.8268
  },
  {
    "zipCode": 1804,
    "city": "Corsier-sur-Vevey",
    "lat": 46.4944,
    "long": 6.871
  },
  {
    "zipCode": 1805,
    "city": "Jongny",
    "lat": 46.4788,
    "long": 6.8411
  },
  {
    "zipCode": 1806,
    "city": "St-Légier-La Chiésaz",
    "lat": 46.4723,
    "long": 6.8737
  },
  {
    "zipCode": 1807,
    "city": "Blonay",
    "lat": 46.4678,
    "long": 6.8962
  },
  {
    "zipCode": 1808,
    "city": "Les Monts-de-Corsier",
    "lat": 46.5044,
    "long": 6.8807
  },
  {
    "zipCode": 1809,
    "city": "Fenil-sur-Corsier",
    "lat": 46.4836,
    "long": 6.8635
  },
  {
    "zipCode": 1811,
    "city": "Vevey",
    "lat": 46.4642,
    "long": 6.8481
  },
  {
    "zipCode": 1814,
    "city": "La Tour-de-Peilz",
    "lat": 46.4531,
    "long": 6.8586
  },
  {
    "zipCode": 1815,
    "city": "Clarens",
    "lat": 46.4405,
    "long": 6.8923
  },
  {
    "zipCode": 1816,
    "city": "Chailly-Montreux",
    "lat": 46.4543,
    "long": 6.8928
  },
  {
    "zipCode": 1817,
    "city": "Brent",
    "lat": 46.4593,
    "long": 6.9032
  },
  {
    "zipCode": 1818,
    "city": "Montreux Redoute",
    "lat": 46.4518,
    "long": 6.9408
  },
  {
    "zipCode": 1820,
    "city": "Montreux",
    "lat": 46.433,
    "long": 6.9114
  },
  {
    "zipCode": 1822,
    "city": "Chernex",
    "lat": 46.4439,
    "long": 6.9115
  },
  {
    "zipCode": 1823,
    "city": "Glion",
    "lat": 46.4336,
    "long": 6.9262
  },
  {
    "zipCode": 1824,
    "city": "Caux",
    "lat": 46.4324,
    "long": 6.9386
  },
  {
    "zipCode": 1832,
    "city": "Villard-sur-Chamby",
    "lat": 46.4722,
    "long": 6.929
  },
  {
    "zipCode": 1832,
    "city": "Chamby",
    "lat": 46.4497,
    "long": 6.9123
  },
  {
    "zipCode": 1833,
    "city": "Les Avants",
    "lat": 46.453,
    "long": 6.9431
  },
  {
    "zipCode": 1844,
    "city": "Villeneuve VD",
    "lat": 46.3987,
    "long": 6.9265
  },
  {
    "zipCode": 1845,
    "city": "Noville",
    "lat": 46.3815,
    "long": 6.9001
  },
  {
    "zipCode": 1846,
    "city": "Chessel",
    "lat": 46.3496,
    "long": 6.897
  },
  {
    "zipCode": 1847,
    "city": "Rennaz",
    "lat": 46.3748,
    "long": 6.916
  },
  {
    "zipCode": 1852,
    "city": "Roche VD",
    "lat": 46.3609,
    "long": 6.9327
  },
  {
    "zipCode": 1853,
    "city": "Yvorne",
    "lat": 46.3312,
    "long": 6.9587
  },
  {
    "zipCode": 1854,
    "city": "Leysin",
    "lat": 46.3418,
    "long": 7.0115
  },
  {
    "zipCode": 1856,
    "city": "Corbeyrier",
    "lat": 46.3501,
    "long": 6.9602
  },
  {
    "zipCode": 1860,
    "city": "Aigle",
    "lat": 46.3181,
    "long": 6.9646
  },
  {
    "zipCode": 1862,
    "city": "Les Mosses",
    "lat": 46.3953,
    "long": 7.1006
  },
  {
    "zipCode": 1862,
    "city": "La Comballaz",
    "lat": 46.3797,
    "long": 7.0833
  },
  {
    "zipCode": 1863,
    "city": "Le Sépey",
    "lat": 46.3614,
    "long": 7.05
  },
  {
    "zipCode": 1864,
    "city": "Vers-l'Eglise",
    "lat": 46.3537,
    "long": 7.1316
  },
  {
    "zipCode": 1865,
    "city": "Les Diablerets",
    "lat": 46.35,
    "long": 7.159
  },
  {
    "zipCode": 1866,
    "city": "La Forclaz VD",
    "lat": 46.3507,
    "long": 7.0689
  },
  {
    "zipCode": 1867,
    "city": "Panex",
    "lat": 46.3118,
    "long": 7.0137
  },
  {
    "zipCode": 1867,
    "city": "St-Triphon",
    "lat": 46.2927,
    "long": 6.9781
  },
  {
    "zipCode": 1867,
    "city": "Ollon VD",
    "lat": 46.2952,
    "long": 6.9931
  },
  {
    "zipCode": 1868,
    "city": "Collombey",
    "lat": 46.2739,
    "long": 6.9479
  },
  {
    "zipCode": 1869,
    "city": "Massongex",
    "lat": 46.2427,
    "long": 6.9888
  },
  {
    "zipCode": 1870,
    "city": "Monthey",
    "lat": 46.2545,
    "long": 6.9541
  },
  {
    "zipCode": 1871,
    "city": "Les Giettes",
    "lat": 46.2275,
    "long": 6.9583
  },
  {
    "zipCode": 1871,
    "city": "Choëx",
    "lat": 46.2413,
    "long": 6.9584
  },
  {
    "zipCode": 1872,
    "city": "Troistorrents",
    "lat": 46.2289,
    "long": 6.9159
  },
  {
    "zipCode": 1873,
    "city": "Val-d'Illiez",
    "lat": 46.2036,
    "long": 6.891
  },
  {
    "zipCode": 1873,
    "city": "Champoussin",
    "lat": 46.2077,
    "long": 6.8639
  },
  {
    "zipCode": 1873,
    "city": "Les Crosets",
    "lat": 46.1851,
    "long": 6.8347
  },
  {
    "zipCode": 1874,
    "city": "Champéry",
    "lat": 46.1754,
    "long": 6.869
  },
  {
    "zipCode": 1875,
    "city": "Morgins",
    "lat": 46.239,
    "long": 6.852
  },
  {
    "zipCode": 1880,
    "city": "Les Plans-sur-Bex",
    "lat": 46.2574,
    "long": 7.0934
  },
  {
    "zipCode": 1880,
    "city": "Fenalet-sur-Bex",
    "lat": 46.2718,
    "long": 7.0276
  },
  {
    "zipCode": 1880,
    "city": "Bex",
    "lat": 46.2497,
    "long": 7.0098
  },
  {
    "zipCode": 1880,
    "city": "Les Posses-sur-Bex",
    "lat": 46.2596,
    "long": 7.0436
  },
  {
    "zipCode": 1880,
    "city": "Frenières-sur-Bex",
    "lat": 46.2596,
    "long": 7.0436
  },
  {
    "zipCode": 1882,
    "city": "Gryon",
    "lat": 46.2738,
    "long": 7.0597
  },
  {
    "zipCode": 1884,
    "city": "Villars-sur-Ollon",
    "lat": 46.2983,
    "long": 7.0563
  },
  {
    "zipCode": 1884,
    "city": "Arveyes",
    "lat": 46.2899,
    "long": 7.0617
  },
  {
    "zipCode": 1884,
    "city": "Huémoz",
    "lat": 46.291,
    "long": 7.0246
  },
  {
    "zipCode": 1885,
    "city": "Chesières",
    "lat": 46.3024,
    "long": 7.0441
  },
  {
    "zipCode": 1890,
    "city": "St-Maurice",
    "lat": 46.2183,
    "long": 7.0032
  },
  {
    "zipCode": 1890,
    "city": "Mex VS",
    "lat": 46.1855,
    "long": 7
  },
  {
    "zipCode": 1891,
    "city": "Vérossaz",
    "lat": 46.2122,
    "long": 6.9863
  },
  {
    "zipCode": 1892,
    "city": "Lavey-Village",
    "lat": 46.2213,
    "long": 7.0148
  },
  {
    "zipCode": 1892,
    "city": "Lavey-les-Bains",
    "lat": 46.2037,
    "long": 7.0187
  },
  {
    "zipCode": 1892,
    "city": "Morcles",
    "lat": 46.2087,
    "long": 7.0363
  },
  {
    "zipCode": 1893,
    "city": "Muraz (Collombey)",
    "lat": 46.2842,
    "long": 6.9334
  },
  {
    "zipCode": 1895,
    "city": "Vionnaz",
    "lat": 46.311,
    "long": 6.9006
  },
  {
    "zipCode": 1896,
    "city": "Vouvry",
    "lat": 46.3375,
    "long": 6.8895
  },
  {
    "zipCode": 1896,
    "city": "Miex",
    "lat": 46.3395,
    "long": 6.867
  },
  {
    "zipCode": 1897,
    "city": "Les Evouettes",
    "lat": 46.362,
    "long": 6.8767
  },
  {
    "zipCode": 1897,
    "city": "Bouveret",
    "lat": 46.3832,
    "long": 6.8596
  },
  {
    "zipCode": 1898,
    "city": "St-Gingolph",
    "lat": 46.3922,
    "long": 6.8059
  },
  {
    "zipCode": 1899,
    "city": "Torgon",
    "lat": 46.3195,
    "long": 6.8753
  },
  {
    "zipCode": 1902,
    "city": "Evionnaz",
    "lat": 46.181,
    "long": 7.0223
  },
  {
    "zipCode": 1903,
    "city": "Collonges",
    "lat": 46.172,
    "long": 7.0343
  },
  {
    "zipCode": 1904,
    "city": "Vernayaz",
    "lat": 46.1367,
    "long": 7.0391
  },
  {
    "zipCode": 1905,
    "city": "Dorénaz",
    "lat": 46.1489,
    "long": 7.0429
  },
  {
    "zipCode": 1906,
    "city": "Charrat",
    "lat": 46.1249,
    "long": 7.1314
  },
  {
    "zipCode": 1907,
    "city": "Saxon",
    "lat": 46.1494,
    "long": 7.1751
  },
  {
    "zipCode": 1908,
    "city": "Riddes",
    "lat": 46.1728,
    "long": 7.2236
  },
  {
    "zipCode": 1911,
    "city": "Mayens-de-Chamoson",
    "lat": 46.2034,
    "long": 7.1843
  },
  {
    "zipCode": 1911,
    "city": "Ovronnaz",
    "lat": 46.199,
    "long": 7.1736
  },
  {
    "zipCode": 1912,
    "city": "Produit (Leytron)",
    "lat": 46.1858,
    "long": 7.1942
  },
  {
    "zipCode": 1912,
    "city": "Montagnon (Leytron)",
    "lat": 46.1901,
    "long": 7.1927
  },
  {
    "zipCode": 1912,
    "city": "Leytron",
    "lat": 46.1866,
    "long": 7.2078
  },
  {
    "zipCode": 1912,
    "city": "Dugny (Leytron)",
    "lat": 46.1875,
    "long": 7.1982
  },
  {
    "zipCode": 1913,
    "city": "Saillon",
    "lat": 46.1703,
    "long": 7.1877
  },
  {
    "zipCode": 1913,
    "city": "Saillon",
    "lat": 46.1703,
    "long": 7.1877
  },
  {
    "zipCode": 1914,
    "city": "Isérables",
    "lat": 46.1623,
    "long": 7.2447
  },
  {
    "zipCode": 1914,
    "city": "Auddes-sur-Riddes",
    "lat": 46.1623,
    "long": 7.2447
  },
  {
    "zipCode": 1918,
    "city": "La Tzoumaz",
    "lat": 46.1448,
    "long": 7.233
  },
  {
    "zipCode": 1919,
    "city": "Martigny Mutuel",
    "lat": 46.1072,
    "long": 7.081
  },
  {
    "zipCode": 1920,
    "city": "Martigny",
    "lat": 46.1028,
    "long": 7.0724
  },
  {
    "zipCode": 1921,
    "city": "Martigny-Croix",
    "lat": 46.086,
    "long": 7.0513
  },
  {
    "zipCode": 1922,
    "city": "Salvan",
    "lat": 46.1189,
    "long": 7.0208
  },
  {
    "zipCode": 1922,
    "city": "Les Granges (Salvan)",
    "lat": 46.1292,
    "long": 7.0231
  },
  {
    "zipCode": 1923,
    "city": "Le Trétien",
    "lat": 46.1022,
    "long": 6.9993
  },
  {
    "zipCode": 1923,
    "city": "Les Marécottes",
    "lat": 46.1114,
    "long": 7.0073
  },
  {
    "zipCode": 1925,
    "city": "Finhaut",
    "lat": 46.0838,
    "long": 6.9778
  },
  {
    "zipCode": 1925,
    "city": "Le Châtelard VS",
    "lat": 46.0617,
    "long": 6.9589
  },
  {
    "zipCode": 1926,
    "city": "Fully",
    "lat": 46.1385,
    "long": 7.1147
  },
  {
    "zipCode": 1927,
    "city": "Chemin",
    "lat": 46.0895,
    "long": 7.0963
  },
  {
    "zipCode": 1928,
    "city": "Ravoire",
    "lat": 46.1007,
    "long": 7.0458
  },
  {
    "zipCode": 1929,
    "city": "Trient",
    "lat": 46.058,
    "long": 6.994
  },
  {
    "zipCode": 1932,
    "city": "Bovernier",
    "lat": 46.079,
    "long": 7.0858
  },
  {
    "zipCode": 1932,
    "city": "Les Valettes (Bovernier)",
    "lat": 46.0753,
    "long": 7.0735
  },
  {
    "zipCode": 1933,
    "city": "Vens (Sembrancher)",
    "lat": 46.0959,
    "long": 7.1535
  },
  {
    "zipCode": 1933,
    "city": "Chamoille (Sembrancher)",
    "lat": 46.0592,
    "long": 7.1555
  },
  {
    "zipCode": 1933,
    "city": "Sembrancher",
    "lat": 46.0775,
    "long": 7.1528
  },
  {
    "zipCode": 1933,
    "city": "La Garde (Sembrancher)",
    "lat": 46.0664,
    "long": 7.1473
  },
  {
    "zipCode": 1934,
    "city": "Bruson",
    "lat": 46.066,
    "long": 7.2183
  },
  {
    "zipCode": 1934,
    "city": "Le Châble VS",
    "lat": 46.066,
    "long": 7.2183
  },
  {
    "zipCode": 1936,
    "city": "Verbier",
    "lat": 46.1002,
    "long": 7.2265
  },
  {
    "zipCode": 1937,
    "city": "Orsières",
    "lat": 46.029,
    "long": 7.1444
  },
  {
    "zipCode": 1938,
    "city": "Champex-Lac",
    "lat": 45.9723,
    "long": 7.1015
  },
  {
    "zipCode": 1941,
    "city": "Cries (Vollèges)",
    "lat": 46.092,
    "long": 7.1755
  },
  {
    "zipCode": 1941,
    "city": "Vollèges",
    "lat": 46.0862,
    "long": 7.17
  },
  {
    "zipCode": 1942,
    "city": "Levron",
    "lat": 46.1002,
    "long": 7.1638
  },
  {
    "zipCode": 1943,
    "city": "Praz-de-Fort",
    "lat": 45.9878,
    "long": 7.1226
  },
  {
    "zipCode": 1944,
    "city": "La Fouly VS",
    "lat": 45.9336,
    "long": 7.0977
  },
  {
    "zipCode": 1945,
    "city": "Liddes",
    "lat": 45.9925,
    "long": 7.1873
  },
  {
    "zipCode": 1945,
    "city": "Palasuit (Liddes)",
    "lat": 45.9822,
    "long": 7.1933
  },
  {
    "zipCode": 1945,
    "city": "Les Moulins VS (Liddes)",
    "lat": 46.0046,
    "long": 7.168
  },
  {
    "zipCode": 1945,
    "city": "Fontaine Dessus (Liddes)",
    "lat": 46.0054,
    "long": 7.1749
  },
  {
    "zipCode": 1945,
    "city": "Vichères (Liddes)",
    "lat": 45.9973,
    "long": 7.1675
  },
  {
    "zipCode": 1945,
    "city": "Rive Haute (Liddes)",
    "lat": 46.0088,
    "long": 7.1684
  },
  {
    "zipCode": 1945,
    "city": "Chandonne (Liddes)",
    "lat": 46.0066,
    "long": 7.1806
  },
  {
    "zipCode": 1945,
    "city": "Chez Petit (Liddes)",
    "lat": 45.9875,
    "long": 7.1772
  },
  {
    "zipCode": 1945,
    "city": "Dranse (Liddes)",
    "lat": 45.989,
    "long": 7.1804
  },
  {
    "zipCode": 1945,
    "city": "Fontaine Dessous (Liddes)",
    "lat": 45.9983,
    "long": 7.176
  },
  {
    "zipCode": 1945,
    "city": "Fornex (Liddes)",
    "lat": 46.009,
    "long": 7.1622
  },
  {
    "zipCode": 1945,
    "city": "Petit Vichères (Liddes)",
    "lat": 45.9983,
    "long": 7.176
  },
  {
    "zipCode": 1946,
    "city": "Bourg-St-Pierre",
    "lat": 45.9488,
    "long": 7.2077
  },
  {
    "zipCode": 1947,
    "city": "Champsec",
    "lat": 46.0581,
    "long": 7.243
  },
  {
    "zipCode": 1947,
    "city": "Versegères",
    "lat": 46.0671,
    "long": 7.2348
  },
  {
    "zipCode": 1948,
    "city": "Lourtier",
    "lat": 46.0488,
    "long": 7.2668
  },
  {
    "zipCode": 1948,
    "city": "Sarreyer",
    "lat": 46.064,
    "long": 7.2519
  },
  {
    "zipCode": 1948,
    "city": "Fionnay",
    "lat": 46.032,
    "long": 7.3089
  },
  {
    "zipCode": 1950,
    "city": "Sion",
    "lat": 46.2274,
    "long": 7.3556
  },
  {
    "zipCode": 1951,
    "city": "Sion",
    "lat": 46.2304,
    "long": 7.3661
  },
  {
    "zipCode": 1955,
    "city": "Némiaz (Chamoson)",
    "lat": 46.2123,
    "long": 7.2235
  },
  {
    "zipCode": 1955,
    "city": "Les Vérines (Chamoson)",
    "lat": 46.2105,
    "long": 7.2044
  },
  {
    "zipCode": 1955,
    "city": "Grugnay (Chamoson)",
    "lat": 46.208,
    "long": 7.219
  },
  {
    "zipCode": 1955,
    "city": "Chamoson",
    "lat": 46.2027,
    "long": 7.2232
  },
  {
    "zipCode": 1955,
    "city": "St-Pierre-de-Clages",
    "lat": 46.1921,
    "long": 7.2369
  },
  {
    "zipCode": 1957,
    "city": "Ardon",
    "lat": 46.2095,
    "long": 7.2601
  },
  {
    "zipCode": 1958,
    "city": "St-Léonard",
    "lat": 46.2515,
    "long": 7.4171
  },
  {
    "zipCode": 1958,
    "city": "Uvrier",
    "lat": 46.2486,
    "long": 7.4104
  },
  {
    "zipCode": 1961,
    "city": "Vernamiège",
    "lat": 46.2117,
    "long": 7.4313
  },
  {
    "zipCode": 1962,
    "city": "Pont-de-la-Morge (Sion)",
    "lat": 46.226,
    "long": 7.3139
  },
  {
    "zipCode": 1963,
    "city": "Vétroz",
    "lat": 46.2217,
    "long": 7.2786
  },
  {
    "zipCode": 1964,
    "city": "Conthey",
    "lat": 46.2237,
    "long": 7.3028
  },
  {
    "zipCode": 1965,
    "city": "Mayens-de-la-Zour (Savièse)",
    "lat": 46.2698,
    "long": 7.3569
  },
  {
    "zipCode": 1965,
    "city": "Granois (Savièse)",
    "lat": 46.2489,
    "long": 7.3369
  },
  {
    "zipCode": 1965,
    "city": "Monteiller (Savièse)",
    "lat": 46.2571,
    "long": 7.3565
  },
  {
    "zipCode": 1965,
    "city": "Chandolin (Savièse)",
    "lat": 46.2494,
    "long": 7.3193
  },
  {
    "zipCode": 1965,
    "city": "Diolly (Savièse)",
    "lat": 46.2531,
    "long": 7.3478
  },
  {
    "zipCode": 1965,
    "city": "Ormône (Savièse)",
    "lat": 46.2431,
    "long": 7.3469
  },
  {
    "zipCode": 1965,
    "city": "St-Germain (Savièse)",
    "lat": 46.2496,
    "long": 7.3526
  },
  {
    "zipCode": 1965,
    "city": "Drône (Savièse)",
    "lat": 46.2612,
    "long": 7.3681
  },
  {
    "zipCode": 1965,
    "city": "La Muraz (Savièse)",
    "lat": 46.2531,
    "long": 7.3478
  },
  {
    "zipCode": 1965,
    "city": "Roumaz (Savièse)",
    "lat": 46.2453,
    "long": 7.3456
  },
  {
    "zipCode": 1966,
    "city": "Botyre (Ayent)",
    "lat": 46.2753,
    "long": 7.406
  },
  {
    "zipCode": 1966,
    "city": "St-Romain (Ayent)",
    "lat": 46.2831,
    "long": 7.4117
  },
  {
    "zipCode": 1966,
    "city": "Blignou (Ayent)",
    "lat": 46.2734,
    "long": 7.4012
  },
  {
    "zipCode": 1966,
    "city": "Signèse (Ayent)",
    "lat": 46.278,
    "long": 7.4094
  },
  {
    "zipCode": 1966,
    "city": "Villa (Ayent)",
    "lat": 46.2764,
    "long": 7.4165
  },
  {
    "zipCode": 1966,
    "city": "Fortunau (Ayent)",
    "lat": 46.2869,
    "long": 7.4153
  },
  {
    "zipCode": 1966,
    "city": "Argnou (Ayent)",
    "lat": 46.2636,
    "long": 7.3997
  },
  {
    "zipCode": 1966,
    "city": "Saxonne (Ayent)",
    "lat": 46.2811,
    "long": 7.4054
  },
  {
    "zipCode": 1966,
    "city": "Luc (Ayent)",
    "lat": 46.2845,
    "long": 7.4195
  },
  {
    "zipCode": 1966,
    "city": "La Place (Ayent)",
    "lat": 46.278,
    "long": 7.4094
  },
  {
    "zipCode": 1967,
    "city": "Bramois",
    "lat": 46.2324,
    "long": 7.4007
  },
  {
    "zipCode": 1968,
    "city": "Mase",
    "lat": 46.1952,
    "long": 7.4347
  },
  {
    "zipCode": 1969,
    "city": "Liez (St-Martin)",
    "lat": 46.1615,
    "long": 7.451
  },
  {
    "zipCode": 1969,
    "city": "Eison (St-Martin)",
    "lat": 46.1615,
    "long": 7.451
  },
  {
    "zipCode": 1969,
    "city": "St-Martin VS",
    "lat": 46.1615,
    "long": 7.451
  },
  {
    "zipCode": 1969,
    "city": "Suen (St-Martin)",
    "lat": 46.1615,
    "long": 7.451
  },
  {
    "zipCode": 1969,
    "city": "Trogne (St-Martin)",
    "lat": 46.1615,
    "long": 7.451
  },
  {
    "zipCode": 1971,
    "city": "Grimisuat",
    "lat": 46.2594,
    "long": 7.3841
  },
  {
    "zipCode": 1971,
    "city": "Champlan (Grimisuat)",
    "lat": 46.2471,
    "long": 7.3729
  },
  {
    "zipCode": 1972,
    "city": "Anzère",
    "lat": 46.2956,
    "long": 7.3962
  },
  {
    "zipCode": 1973,
    "city": "Nax",
    "lat": 46.2282,
    "long": 7.431
  },
  {
    "zipCode": 1974,
    "city": "Arbaz",
    "lat": 46.2781,
    "long": 7.3854
  },
  {
    "zipCode": 1975,
    "city": "St-Séverin",
    "lat": 46.2349,
    "long": 7.3007
  },
  {
    "zipCode": 1976,
    "city": "Aven",
    "lat": 46.2376,
    "long": 7.2731
  },
  {
    "zipCode": 1976,
    "city": "Erde",
    "lat": 46.2388,
    "long": 7.2876
  },
  {
    "zipCode": 1976,
    "city": "Daillon",
    "lat": 46.2574,
    "long": 7.3067
  },
  {
    "zipCode": 1977,
    "city": "Icogne",
    "lat": 46.2919,
    "long": 7.4405
  },
  {
    "zipCode": 1978,
    "city": "Lens",
    "lat": 46.283,
    "long": 7.4498
  },
  {
    "zipCode": 1981,
    "city": "Vex",
    "lat": 46.2124,
    "long": 7.3983
  },
  {
    "zipCode": 1982,
    "city": "Euseigne",
    "lat": 46.1721,
    "long": 7.4231
  },
  {
    "zipCode": 1983,
    "city": "Lanna",
    "lat": 46.1333,
    "long": 7.4833
  },
  {
    "zipCode": 1983,
    "city": "Evolène",
    "lat": 46.1142,
    "long": 7.4941
  },
  {
    "zipCode": 1984,
    "city": "La Tour VS",
    "lat": 46.0982,
    "long": 7.5057
  },
  {
    "zipCode": 1984,
    "city": "Les Haudères",
    "lat": 46.0832,
    "long": 7.509
  },
  {
    "zipCode": 1985,
    "city": "La Sage",
    "lat": 46.0997,
    "long": 7.516
  },
  {
    "zipCode": 1985,
    "city": "La Forclaz VS",
    "lat": 46.0872,
    "long": 7.5212
  },
  {
    "zipCode": 1985,
    "city": "Villa (Evolène)",
    "lat": 46.1076,
    "long": 7.5134
  },
  {
    "zipCode": 1986,
    "city": "Arolla",
    "lat": 46.0254,
    "long": 7.4836
  },
  {
    "zipCode": 1987,
    "city": "Hérémence",
    "lat": 46.1803,
    "long": 7.4048
  },
  {
    "zipCode": 1988,
    "city": "Les Collons",
    "lat": 46.1818,
    "long": 7.3864
  },
  {
    "zipCode": 1988,
    "city": "Thyon",
    "lat": 46.1823,
    "long": 7.3725
  },
  {
    "zipCode": 1991,
    "city": "Turin (Salins)",
    "lat": 46.2155,
    "long": 7.3541
  },
  {
    "zipCode": 1991,
    "city": "Salins",
    "lat": 46.2094,
    "long": 7.3579
  },
  {
    "zipCode": 1991,
    "city": "Pravidondaz (Salins)",
    "lat": 46.2124,
    "long": 7.3549
  },
  {
    "zipCode": 1991,
    "city": "Misériez (Salins)",
    "lat": 46.2121,
    "long": 7.3532
  },
  {
    "zipCode": 1991,
    "city": "Arvillard (Salins)",
    "lat": 46.211,
    "long": 7.3459
  },
  {
    "zipCode": 1992,
    "city": "Les Mayens-de-Sion",
    "lat": 46.2857,
    "long": 7.3361
  },
  {
    "zipCode": 1992,
    "city": "La Vernaz (Les Agettes)",
    "lat": 46.2102,
    "long": 7.3734
  },
  {
    "zipCode": 1992,
    "city": "Les Agettes",
    "lat": 46.1978,
    "long": 7.3683
  },
  {
    "zipCode": 1992,
    "city": "Crête-à-l'Oeil (Les Agettes)",
    "lat": 46.212,
    "long": 7.3715
  },
  {
    "zipCode": 1993,
    "city": "Clèbes (Nendaz)",
    "lat": 46.1875,
    "long": 7.3375
  },
  {
    "zipCode": 1993,
    "city": "Veysonnaz",
    "lat": 46.1952,
    "long": 7.3356
  },
  {
    "zipCode": 1994,
    "city": "Aproz (Nendaz)",
    "lat": 46.2055,
    "long": 7.3108
  },
  {
    "zipCode": 1996,
    "city": "Baar (Nendaz)",
    "lat": 46.2057,
    "long": 7.3321
  },
  {
    "zipCode": 1996,
    "city": "Saclentse",
    "lat": 46.1761,
    "long": 7.3178
  },
  {
    "zipCode": 1996,
    "city": "Condémines (Nendaz)",
    "lat": 46.1755,
    "long": 7.2554
  },
  {
    "zipCode": 1996,
    "city": "Bieudron (Nendaz)",
    "lat": 46.194,
    "long": 7.2797
  },
  {
    "zipCode": 1996,
    "city": "Basse-Nendaz",
    "lat": 46.1899,
    "long": 7.3121
  },
  {
    "zipCode": 1996,
    "city": "Fey (Nendaz)",
    "lat": 46.1868,
    "long": 7.2699
  },
  {
    "zipCode": 1996,
    "city": "Beuson (Nendaz)",
    "lat": 46.1667,
    "long": 7.3
  },
  {
    "zipCode": 1996,
    "city": "Brignon (Nendaz)",
    "lat": 46.1896,
    "long": 7.3261
  },
  {
    "zipCode": 1997,
    "city": "Siviez (Nendaz)",
    "lat": 46.1366,
    "long": 7.316
  },
  {
    "zipCode": 1997,
    "city": "Sornard (Nendaz)",
    "lat": 46.1887,
    "long": 7.3032
  },
  {
    "zipCode": 1997,
    "city": "Haute-Nendaz",
    "lat": 46.1872,
    "long": 7.2975
  },
  {
    "zipCode": 2000,
    "city": "Neuchâtel",
    "lat": 46.9918,
    "long": 6.931
  },
  {
    "zipCode": 2001,
    "city": "Neuchâtel 1",
    "lat": 47.0094,
    "long": 6.9381
  },
  {
    "zipCode": 2002,
    "city": "Neuchâtel 2",
    "lat": 47.0094,
    "long": 6.9381
  },
  {
    "zipCode": 2010,
    "city": "Neuchâtel OFS",
    "lat": 47.0094,
    "long": 6.9381
  },
  {
    "zipCode": 2012,
    "city": "Auvernier",
    "lat": 46.9755,
    "long": 6.879
  },
  {
    "zipCode": 2013,
    "city": "Colombier NE",
    "lat": 46.9663,
    "long": 6.8648
  },
  {
    "zipCode": 2014,
    "city": "Bôle",
    "lat": 46.966,
    "long": 6.842
  },
  {
    "zipCode": 2015,
    "city": "Areuse",
    "lat": 46.9535,
    "long": 6.8538
  },
  {
    "zipCode": 2016,
    "city": "Cortaillod",
    "lat": 46.9431,
    "long": 6.8444
  },
  {
    "zipCode": 2017,
    "city": "Boudry",
    "lat": 46.9499,
    "long": 6.8376
  },
  {
    "zipCode": 2019,
    "city": "Chambrelien",
    "lat": 46.9723,
    "long": 6.8158
  },
  {
    "zipCode": 2019,
    "city": "Rochefort",
    "lat": 46.9793,
    "long": 6.8146
  },
  {
    "zipCode": 2022,
    "city": "Bevaix",
    "lat": 46.9296,
    "long": 6.8147
  },
  {
    "zipCode": 2023,
    "city": "Gorgier",
    "lat": 46.9014,
    "long": 6.7799
  },
  {
    "zipCode": 2024,
    "city": "St-Aubin-Sauges",
    "lat": 46.8942,
    "long": 6.7725
  },
  {
    "zipCode": 2025,
    "city": "Chez-le-Bart",
    "lat": 46.9021,
    "long": 6.7857
  },
  {
    "zipCode": 2027,
    "city": "Fresens",
    "lat": 46.8886,
    "long": 6.7478
  },
  {
    "zipCode": 2027,
    "city": "Montalchez",
    "lat": 46.8982,
    "long": 6.7446
  },
  {
    "zipCode": 2028,
    "city": "Vaumarcus",
    "lat": 46.8791,
    "long": 6.7573
  },
  {
    "zipCode": 2034,
    "city": "Peseux",
    "lat": 46.987,
    "long": 6.889
  },
  {
    "zipCode": 2035,
    "city": "Corcelles NE",
    "lat": 46.9864,
    "long": 6.8775
  },
  {
    "zipCode": 2036,
    "city": "Cormondrèche",
    "lat": 46.9864,
    "long": 6.8775
  },
  {
    "zipCode": 2037,
    "city": "Montezillon",
    "lat": 46.9866,
    "long": 6.8366
  },
  {
    "zipCode": 2037,
    "city": "Montmollin",
    "lat": 46.9928,
    "long": 6.8465
  },
  {
    "zipCode": 2042,
    "city": "Valangin",
    "lat": 47.0161,
    "long": 6.9067
  },
  {
    "zipCode": 2043,
    "city": "Boudevilliers",
    "lat": 47.0272,
    "long": 6.8891
  },
  {
    "zipCode": 2046,
    "city": "Fontaines NE",
    "lat": 47.0436,
    "long": 6.9035
  },
  {
    "zipCode": 2052,
    "city": "Fontainemelon",
    "lat": 47.0549,
    "long": 6.8868
  },
  {
    "zipCode": 2052,
    "city": "La Vue-des-Alpes",
    "lat": 47.0736,
    "long": 6.8713
  },
  {
    "zipCode": 2053,
    "city": "Cernier",
    "lat": 47.0588,
    "long": 6.9004
  },
  {
    "zipCode": 2054,
    "city": "Les Vieux-Prés",
    "lat": 47.0721,
    "long": 6.9293
  },
  {
    "zipCode": 2054,
    "city": "Chézard-St-Martin",
    "lat": 47.0721,
    "long": 6.9293
  },
  {
    "zipCode": 2056,
    "city": "Dombresson",
    "lat": 47.0719,
    "long": 6.9592
  },
  {
    "zipCode": 2057,
    "city": "Villiers",
    "lat": 47.0751,
    "long": 6.9715
  },
  {
    "zipCode": 2058,
    "city": "Le Pâquier NE",
    "lat": 47.0984,
    "long": 6.9864
  },
  {
    "zipCode": 2063,
    "city": "Vilars NE",
    "lat": 47.033,
    "long": 6.9278
  },
  {
    "zipCode": 2063,
    "city": "Saules",
    "lat": 47.0397,
    "long": 6.9407
  },
  {
    "zipCode": 2063,
    "city": "Fenin",
    "lat": 47.0267,
    "long": 6.923
  },
  {
    "zipCode": 2063,
    "city": "Engollon",
    "lat": 47.0391,
    "long": 6.92
  },
  {
    "zipCode": 2065,
    "city": "Savagnier",
    "lat": 47.05,
    "long": 6.95
  },
  {
    "zipCode": 2067,
    "city": "Chaumont",
    "lat": 47.0282,
    "long": 6.9562
  },
  {
    "zipCode": 2068,
    "city": "Hauterive NE",
    "lat": 47.0123,
    "long": 6.9761
  },
  {
    "zipCode": 2072,
    "city": "St-Blaise",
    "lat": 47.0151,
    "long": 6.9883
  },
  {
    "zipCode": 2073,
    "city": "Enges",
    "lat": 47.0667,
    "long": 7.0166
  },
  {
    "zipCode": 2074,
    "city": "Marin-Epagnier",
    "lat": 47.0102,
    "long": 6.9994
  },
  {
    "zipCode": 2075,
    "city": "Wavre",
    "lat": 47.0215,
    "long": 7.0292
  },
  {
    "zipCode": 2075,
    "city": "Thielle",
    "lat": 47.0215,
    "long": 7.0292
  },
  {
    "zipCode": 2087,
    "city": "Cornaux NE",
    "lat": 47.0396,
    "long": 7.0187
  },
  {
    "zipCode": 2088,
    "city": "Cressier NE",
    "lat": 47.0491,
    "long": 7.0346
  },
  {
    "zipCode": 2103,
    "city": "Noiraigue",
    "lat": 46.9562,
    "long": 6.7246
  },
  {
    "zipCode": 2105,
    "city": "Travers",
    "lat": 46.9402,
    "long": 6.676
  },
  {
    "zipCode": 2108,
    "city": "Couvet",
    "lat": 46.9253,
    "long": 6.6327
  },
  {
    "zipCode": 2112,
    "city": "Môtiers NE",
    "lat": 46.9111,
    "long": 6.6111
  },
  {
    "zipCode": 2113,
    "city": "Boveresse",
    "lat": 46.9182,
    "long": 6.6006
  },
  {
    "zipCode": 2114,
    "city": "Fleurier",
    "lat": 46.9022,
    "long": 6.5825
  },
  {
    "zipCode": 2115,
    "city": "Buttes",
    "lat": 46.8881,
    "long": 6.5514
  },
  {
    "zipCode": 2116,
    "city": "Mont-de-Buttes",
    "lat": 46.8779,
    "long": 6.5086
  },
  {
    "zipCode": 2117,
    "city": "La Côte-aux-Fées",
    "lat": 46.8674,
    "long": 6.4904
  },
  {
    "zipCode": 2123,
    "city": "St-Sulpice NE",
    "lat": 46.9111,
    "long": 6.5622
  },
  {
    "zipCode": 2124,
    "city": "Les Sagnettes",
    "lat": 46.9404,
    "long": 6.5941
  },
  {
    "zipCode": 2126,
    "city": "Les Verrières",
    "lat": 46.9041,
    "long": 6.4804
  },
  {
    "zipCode": 2127,
    "city": "Les Bayards",
    "lat": 46.9159,
    "long": 6.5124
  },
  {
    "zipCode": 2149,
    "city": "Fretereules",
    "lat": 46.9865,
    "long": 6.8038
  },
  {
    "zipCode": 2149,
    "city": "Brot-Dessous",
    "lat": 46.9865,
    "long": 6.8038
  },
  {
    "zipCode": 2149,
    "city": "Champ-du-Moulin",
    "lat": 46.959,
    "long": 6.7579
  },
  {
    "zipCode": 2206,
    "city": "Les Geneveys-sur-Coffrane",
    "lat": 47.0153,
    "long": 6.8513
  },
  {
    "zipCode": 2207,
    "city": "Coffrane",
    "lat": 47.0101,
    "long": 6.8632
  },
  {
    "zipCode": 2208,
    "city": "Les Hauts-Geneveys",
    "lat": 47.0498,
    "long": 6.873
  },
  {
    "zipCode": 2300,
    "city": "La Chaux-de-Fonds",
    "lat": 47.0999,
    "long": 6.8259
  },
  {
    "zipCode": 2301,
    "city": "La Chaux-de-Fonds",
    "lat": 47.1102,
    "long": 6.8334
  },
  {
    "zipCode": 2303,
    "city": "La Chaux-de-Fonds",
    "lat": 47.1102,
    "long": 6.8334
  },
  {
    "zipCode": 2304,
    "city": "La Chaux-de-Fonds",
    "lat": 47.1102,
    "long": 6.8334
  },
  {
    "zipCode": 2314,
    "city": "La Sagne NE",
    "lat": 47.0459,
    "long": 6.8095
  },
  {
    "zipCode": 2316,
    "city": "Les Ponts-de-Martel",
    "lat": 46.9974,
    "long": 6.7306
  },
  {
    "zipCode": 2316,
    "city": "Petit-Martel",
    "lat": 47.0121,
    "long": 6.7563
  },
  {
    "zipCode": 2318,
    "city": "Brot-Plamboz",
    "lat": 46.9854,
    "long": 6.7478
  },
  {
    "zipCode": 2322,
    "city": "Le Crêt-du-Locle",
    "lat": 47.0771,
    "long": 6.7871
  },
  {
    "zipCode": 2325,
    "city": "Les Planchettes",
    "lat": 47.1062,
    "long": 6.7702
  },
  {
    "zipCode": 2333,
    "city": "La Ferrière",
    "lat": 47.143,
    "long": 6.8922
  },
  {
    "zipCode": 2333,
    "city": "La Cibourg",
    "lat": 47.0927,
    "long": 6.8169
  },
  {
    "zipCode": 2336,
    "city": "Les Bois",
    "lat": 47.1771,
    "long": 6.905
  },
  {
    "zipCode": 2338,
    "city": "Les Emibois",
    "lat": 47.2332,
    "long": 6.9867
  },
  {
    "zipCode": 2338,
    "city": "Muriaux",
    "lat": 47.2458,
    "long": 6.9791
  },
  {
    "zipCode": 2340,
    "city": "Le Noirmont",
    "lat": 47.2257,
    "long": 6.9573
  },
  {
    "zipCode": 2345,
    "city": "Le Cerneux-Veusil",
    "lat": 47.1794,
    "long": 6.9669
  },
  {
    "zipCode": 2345,
    "city": "La Chaux-des-Breuleux",
    "lat": 47.2221,
    "long": 7.0283
  },
  {
    "zipCode": 2345,
    "city": "Les Breuleux",
    "lat": 47.211,
    "long": 7.0079
  },
  {
    "zipCode": 2350,
    "city": "Saignelégier",
    "lat": 47.2562,
    "long": 6.9965
  },
  {
    "zipCode": 2353,
    "city": "Les Pommerats",
    "lat": 47.2716,
    "long": 6.9849
  },
  {
    "zipCode": 2354,
    "city": "Goumois",
    "lat": 47.2611,
    "long": 6.9524
  },
  {
    "zipCode": 2360,
    "city": "Le Bémont JU",
    "lat": 47.263,
    "long": 7.0152
  },
  {
    "zipCode": 2362,
    "city": "Montfavergier",
    "lat": 47.3088,
    "long": 7.0881
  },
  {
    "zipCode": 2362,
    "city": "Montfaucon",
    "lat": 47.2821,
    "long": 7.0512
  },
  {
    "zipCode": 2363,
    "city": "Les Enfers",
    "lat": 47.2893,
    "long": 7.043
  },
  {
    "zipCode": 2364,
    "city": "St-Brais",
    "lat": 47.3061,
    "long": 7.1137
  },
  {
    "zipCode": 2400,
    "city": "Le Locle",
    "lat": 47.0562,
    "long": 6.7491
  },
  {
    "zipCode": 2400,
    "city": "Le Prévoux",
    "lat": 47.0383,
    "long": 6.7033
  },
  {
    "zipCode": 2400,
    "city": "Le Locle",
    "lat": 47.0562,
    "long": 6.7491
  },
  {
    "zipCode": 2405,
    "city": "La Chaux-du-Milieu",
    "lat": 47.0133,
    "long": 6.7012
  },
  {
    "zipCode": 2406,
    "city": "La Châtagne",
    "lat": 46.9902,
    "long": 6.6421
  },
  {
    "zipCode": 2406,
    "city": "Les Taillères",
    "lat": 46.9706,
    "long": 6.5762
  },
  {
    "zipCode": 2406,
    "city": "Le Brouillet",
    "lat": 46.9499,
    "long": 6.534
  },
  {
    "zipCode": 2406,
    "city": "La Brévine",
    "lat": 46.9805,
    "long": 6.6064
  },
  {
    "zipCode": 2414,
    "city": "Le Cerneux-Péquignot",
    "lat": 47.0159,
    "long": 6.6707
  },
  {
    "zipCode": 2416,
    "city": "Les Brenets",
    "lat": 47.0677,
    "long": 6.7048
  },
  {
    "zipCode": 2500,
    "city": "Bienne",
    "lat": 47.1492,
    "long": 7.2611
  },
  {
    "zipCode": 2501,
    "city": "Biel/Bienne",
    "lat": 47.1492,
    "long": 7.2611
  },
  {
    "zipCode": 2502,
    "city": "Biel/Bienne",
    "lat": 47.1371,
    "long": 7.2461
  },
  {
    "zipCode": 2503,
    "city": "Biel/Bienne",
    "lat": 47.1371,
    "long": 7.2461
  },
  {
    "zipCode": 2504,
    "city": "Biel/Bienne",
    "lat": 47.1371,
    "long": 7.2461
  },
  {
    "zipCode": 2505,
    "city": "Biel/Bienne",
    "lat": 47.1371,
    "long": 7.2461
  },
  {
    "zipCode": 2512,
    "city": "Tüscherz-Alfermée",
    "lat": 47.1141,
    "long": 7.1942
  },
  {
    "zipCode": 2513,
    "city": "Twann",
    "lat": 47.0942,
    "long": 7.157
  },
  {
    "zipCode": 2514,
    "city": "Ligerz",
    "lat": 47.0837,
    "long": 7.1348
  },
  {
    "zipCode": 2515,
    "city": "Prêles",
    "lat": 47.0993,
    "long": 7.1302
  },
  {
    "zipCode": 2516,
    "city": "Lamboing",
    "lat": 47.1168,
    "long": 7.1348
  },
  {
    "zipCode": 2517,
    "city": "Diesse",
    "lat": 47.1134,
    "long": 7.1169
  },
  {
    "zipCode": 2518,
    "city": "Nods",
    "lat": 47.1149,
    "long": 7.0801
  },
  {
    "zipCode": 2520,
    "city": "La Neuveville",
    "lat": 47.0659,
    "long": 7.0972
  },
  {
    "zipCode": 2523,
    "city": "Lignières",
    "lat": 47.0833,
    "long": 7.0659
  },
  {
    "zipCode": 2525,
    "city": "Le Landeron",
    "lat": 47.057,
    "long": 7.0705
  },
  {
    "zipCode": 2532,
    "city": "Macolin",
    "lat": 47.139,
    "long": 7.2141
  },
  {
    "zipCode": 2533,
    "city": "Evilard",
    "lat": 47.1505,
    "long": 7.239
  },
  {
    "zipCode": 2534,
    "city": "Les Prés-d'Orvin",
    "lat": 47.157,
    "long": 7.176
  },
  {
    "zipCode": 2534,
    "city": "Orvin",
    "lat": 47.1607,
    "long": 7.2137
  },
  {
    "zipCode": 2535,
    "city": "Frinvillier",
    "lat": 47.1691,
    "long": 7.2549
  },
  {
    "zipCode": 2536,
    "city": "Plagne",
    "lat": 47.1883,
    "long": 7.2871
  },
  {
    "zipCode": 2537,
    "city": "Vauffelin",
    "lat": 47.1873,
    "long": 7.3001
  },
  {
    "zipCode": 2538,
    "city": "Romont BE",
    "lat": 47.1886,
    "long": 7.3406
  },
  {
    "zipCode": 2540,
    "city": "Granges",
    "lat": 47.1921,
    "long": 7.3959
  },
  {
    "zipCode": 2542,
    "city": "Pieterlen",
    "lat": 47.175,
    "long": 7.3379
  },
  {
    "zipCode": 2543,
    "city": "Lengnau BE",
    "lat": 47.1815,
    "long": 7.3681
  },
  {
    "zipCode": 2544,
    "city": "Bettlach",
    "lat": 47.2006,
    "long": 7.4241
  },
  {
    "zipCode": 2545,
    "city": "Selzach",
    "lat": 47.2053,
    "long": 7.4552
  },
  {
    "zipCode": 2552,
    "city": "Orpund",
    "lat": 47.1389,
    "long": 7.3078
  },
  {
    "zipCode": 2553,
    "city": "Safnern",
    "lat": 47.15,
    "long": 7.3231
  },
  {
    "zipCode": 2554,
    "city": "Meinisberg",
    "lat": 47.1597,
    "long": 7.348
  },
  {
    "zipCode": 2555,
    "city": "Brügg BE",
    "lat": 47.1237,
    "long": 7.2789
  },
  {
    "zipCode": 2556,
    "city": "Scheuren",
    "lat": 47.1347,
    "long": 7.3209
  },
  {
    "zipCode": 2556,
    "city": "Schwadernau",
    "lat": 47.1278,
    "long": 7.3078
  },
  {
    "zipCode": 2557,
    "city": "Studen BE",
    "lat": 47.113,
    "long": 7.3032
  },
  {
    "zipCode": 2558,
    "city": "Aegerten",
    "lat": 47.1211,
    "long": 7.2916
  },
  {
    "zipCode": 2560,
    "city": "Nidau",
    "lat": 47.1255,
    "long": 7.2403
  },
  {
    "zipCode": 2562,
    "city": "Port",
    "lat": 47.1141,
    "long": 7.2589
  },
  {
    "zipCode": 2563,
    "city": "Ipsach",
    "lat": 47.1139,
    "long": 7.2303
  },
  {
    "zipCode": 2564,
    "city": "Bellmund",
    "lat": 47.1085,
    "long": 7.2461
  },
  {
    "zipCode": 2565,
    "city": "Jens",
    "lat": 47.0963,
    "long": 7.2636
  },
  {
    "zipCode": 2572,
    "city": "Mörigen",
    "lat": 47.0851,
    "long": 7.2141
  },
  {
    "zipCode": 2572,
    "city": "Sutz",
    "lat": 47.1034,
    "long": 7.2208
  },
  {
    "zipCode": 2575,
    "city": "Täuffelen",
    "lat": 47.0652,
    "long": 7.197
  },
  {
    "zipCode": 2575,
    "city": "Hagneck",
    "lat": 47.057,
    "long": 7.1853
  },
  {
    "zipCode": 2575,
    "city": "Gerolfingen",
    "lat": 47.0771,
    "long": 7.1989
  },
  {
    "zipCode": 2576,
    "city": "Lüscherz",
    "lat": 47.0446,
    "long": 7.1527
  },
  {
    "zipCode": 2577,
    "city": "Finsterhennen",
    "lat": 47.0248,
    "long": 7.1754
  },
  {
    "zipCode": 2577,
    "city": "Siselen BE",
    "lat": 47.0324,
    "long": 7.1888
  },
  {
    "zipCode": 2603,
    "city": "Péry",
    "lat": 47.194,
    "long": 7.2491
  },
  {
    "zipCode": 2604,
    "city": "La Heutte",
    "lat": 47.1907,
    "long": 7.2261
  },
  {
    "zipCode": 2605,
    "city": "Sonceboz-Sombeval",
    "lat": 47.1915,
    "long": 7.1785
  },
  {
    "zipCode": 2606,
    "city": "Corgémont",
    "lat": 47.1946,
    "long": 7.1452
  },
  {
    "zipCode": 2607,
    "city": "Cortébert",
    "lat": 47.1883,
    "long": 7.1089
  },
  {
    "zipCode": 2608,
    "city": "Courtelary",
    "lat": 47.1782,
    "long": 7.0724
  },
  {
    "zipCode": 2608,
    "city": "Montagne-de-Courtelary",
    "lat": 47.1757,
    "long": 7.1111
  },
  {
    "zipCode": 2610,
    "city": "Les Pontins",
    "lat": 47.1312,
    "long": 6.9989
  },
  {
    "zipCode": 2610,
    "city": "Mont-Soleil",
    "lat": 47.1597,
    "long": 6.9868
  },
  {
    "zipCode": 2610,
    "city": "Mont-Crosin",
    "lat": 47.1835,
    "long": 7.0343
  },
  {
    "zipCode": 2610,
    "city": "St-Imier",
    "lat": 47.1582,
    "long": 7.0066
  },
  {
    "zipCode": 2612,
    "city": "Cormoret",
    "lat": 47.1708,
    "long": 7.0542
  },
  {
    "zipCode": 2613,
    "city": "Villeret",
    "lat": 47.1584,
    "long": 7.0189
  },
  {
    "zipCode": 2615,
    "city": "Sonvilier",
    "lat": 47.1388,
    "long": 6.964
  },
  {
    "zipCode": 2615,
    "city": "Montagne-de-Sonvilier",
    "lat": 47.1388,
    "long": 6.964
  },
  {
    "zipCode": 2616,
    "city": "Renan BE",
    "lat": 47.1269,
    "long": 6.9283
  },
  {
    "zipCode": 2616,
    "city": "La Cibourg",
    "lat": 47.0927,
    "long": 6.8169
  },
  {
    "zipCode": 2710,
    "city": "Tavannes",
    "lat": 47.2208,
    "long": 7.1976
  },
  {
    "zipCode": 2712,
    "city": "Le Fuet",
    "lat": 47.2448,
    "long": 7.184
  },
  {
    "zipCode": 2713,
    "city": "Bellelay",
    "lat": 47.2633,
    "long": 7.1666
  },
  {
    "zipCode": 2714,
    "city": "Les Genevez JU",
    "lat": 47.2577,
    "long": 7.1092
  },
  {
    "zipCode": 2714,
    "city": "Le Prédame",
    "lat": 47.2577,
    "long": 7.1092
  },
  {
    "zipCode": 2715,
    "city": "Châtelat",
    "lat": 47.2628,
    "long": 7.1885
  },
  {
    "zipCode": 2715,
    "city": "Monible",
    "lat": 47.277,
    "long": 7.2033
  },
  {
    "zipCode": 2716,
    "city": "Sornetan",
    "lat": 47.2746,
    "long": 7.2169
  },
  {
    "zipCode": 2717,
    "city": "Rebévelier",
    "lat": 47.2914,
    "long": 7.1923
  },
  {
    "zipCode": 2717,
    "city": "Fornet-Dessous",
    "lat": 47.2914,
    "long": 7.1923
  },
  {
    "zipCode": 2718,
    "city": "Lajoux JU",
    "lat": 47.2789,
    "long": 7.1373
  },
  {
    "zipCode": 2718,
    "city": "Fornet-Dessus",
    "lat": 47.2789,
    "long": 7.1373
  },
  {
    "zipCode": 2720,
    "city": "Tramelan",
    "lat": 47.2239,
    "long": 7.0995
  },
  {
    "zipCode": 2720,
    "city": "La Tanne",
    "lat": 47.2221,
    "long": 7.1533
  },
  {
    "zipCode": 2722,
    "city": "Les Reussilles",
    "lat": 47.2259,
    "long": 7.0846
  },
  {
    "zipCode": 2723,
    "city": "Mont-Tramelan",
    "lat": 47.21,
    "long": 7.0648
  },
  {
    "zipCode": 2732,
    "city": "Saicourt",
    "lat": 47.2428,
    "long": 7.2075
  },
  {
    "zipCode": 2732,
    "city": "Saules BE",
    "lat": 47.2457,
    "long": 7.2218
  },
  {
    "zipCode": 2732,
    "city": "Loveresse",
    "lat": 47.2439,
    "long": 7.2388
  },
  {
    "zipCode": 2732,
    "city": "Reconvilier",
    "lat": 47.2343,
    "long": 7.2224
  },
  {
    "zipCode": 2733,
    "city": "Pontenet",
    "lat": 47.2433,
    "long": 7.2546
  },
  {
    "zipCode": 2735,
    "city": "Champoz",
    "lat": 47.2558,
    "long": 7.2953
  },
  {
    "zipCode": 2735,
    "city": "Bévilard",
    "lat": 47.2371,
    "long": 7.2832
  },
  {
    "zipCode": 2735,
    "city": "Malleray",
    "lat": 47.2384,
    "long": 7.2729
  },
  {
    "zipCode": 2736,
    "city": "Sorvilier",
    "lat": 47.2393,
    "long": 7.3037
  },
  {
    "zipCode": 2738,
    "city": "Court",
    "lat": 47.2396,
    "long": 7.3365
  },
  {
    "zipCode": 2740,
    "city": "Moutier",
    "lat": 47.2782,
    "long": 7.3695
  },
  {
    "zipCode": 2742,
    "city": "Perrefitte",
    "lat": 47.2757,
    "long": 7.3416
  },
  {
    "zipCode": 2743,
    "city": "Eschert",
    "lat": 47.2753,
    "long": 7.4013
  },
  {
    "zipCode": 2744,
    "city": "Belprahon",
    "lat": 47.2834,
    "long": 7.4058
  },
  {
    "zipCode": 2745,
    "city": "Grandval",
    "lat": 47.2828,
    "long": 7.425
  },
  {
    "zipCode": 2746,
    "city": "Crémines",
    "lat": 47.2833,
    "long": 7.4403
  },
  {
    "zipCode": 2747,
    "city": "Corcelles BE",
    "lat": 47.2849,
    "long": 7.4524
  },
  {
    "zipCode": 2747,
    "city": "Seehof",
    "lat": 47.3032,
    "long": 7.5209
  },
  {
    "zipCode": 2748,
    "city": "Les Ecorcheresses",
    "lat": 47.2773,
    "long": 7.2803
  },
  {
    "zipCode": 2748,
    "city": "Souboz",
    "lat": 47.2749,
    "long": 7.2445
  },
  {
    "zipCode": 2762,
    "city": "Roches BE",
    "lat": 47.302,
    "long": 7.3813
  },
  {
    "zipCode": 2800,
    "city": "Delémont",
    "lat": 47.3649,
    "long": 7.3445
  },
  {
    "zipCode": 2802,
    "city": "Develier",
    "lat": 47.3577,
    "long": 7.2984
  },
  {
    "zipCode": 2803,
    "city": "Bourrignon",
    "lat": 47.3955,
    "long": 7.2454
  },
  {
    "zipCode": 2805,
    "city": "Soyhières",
    "lat": 47.3911,
    "long": 7.3698
  },
  {
    "zipCode": 2806,
    "city": "Mettembert",
    "lat": 47.3967,
    "long": 7.3205
  },
  {
    "zipCode": 2807,
    "city": "Pleigne",
    "lat": 47.4076,
    "long": 7.2906
  },
  {
    "zipCode": 2807,
    "city": "Lucelle",
    "lat": 47.4076,
    "long": 7.2906
  },
  {
    "zipCode": 2812,
    "city": "Movelier",
    "lat": 47.4095,
    "long": 7.3172
  },
  {
    "zipCode": 2813,
    "city": "Ederswiler",
    "lat": 47.4239,
    "long": 7.331
  },
  {
    "zipCode": 2814,
    "city": "Roggenburg",
    "lat": 47.431,
    "long": 7.3406
  },
  {
    "zipCode": 2822,
    "city": "Courroux",
    "lat": 47.3607,
    "long": 7.3737
  },
  {
    "zipCode": 2823,
    "city": "Courcelon",
    "lat": 47.363,
    "long": 7.3918
  },
  {
    "zipCode": 2824,
    "city": "Vicques",
    "lat": 47.351,
    "long": 7.4027
  },
  {
    "zipCode": 2825,
    "city": "Courchapoix",
    "lat": 47.3473,
    "long": 7.4514
  },
  {
    "zipCode": 2826,
    "city": "Corban",
    "lat": 47.3462,
    "long": 7.4769
  },
  {
    "zipCode": 2827,
    "city": "Schelten",
    "lat": 47.3343,
    "long": 7.5517
  },
  {
    "zipCode": 2827,
    "city": "Mervelier",
    "lat": 47.3435,
    "long": 7.4997
  },
  {
    "zipCode": 2828,
    "city": "Montsevelier",
    "lat": 47.3591,
    "long": 7.5104
  },
  {
    "zipCode": 2829,
    "city": "Vermes",
    "lat": 47.3295,
    "long": 7.4752
  },
  {
    "zipCode": 2830,
    "city": "Vellerat",
    "lat": 47.3203,
    "long": 7.37
  },
  {
    "zipCode": 2830,
    "city": "Courrendlin",
    "lat": 47.3385,
    "long": 7.3724
  },
  {
    "zipCode": 2832,
    "city": "Rebeuvelier",
    "lat": 47.3248,
    "long": 7.4094
  },
  {
    "zipCode": 2842,
    "city": "Rossemaison",
    "lat": 47.3443,
    "long": 7.3409
  },
  {
    "zipCode": 2843,
    "city": "Châtillon JU",
    "lat": 47.3264,
    "long": 7.3448
  },
  {
    "zipCode": 2852,
    "city": "Courtételle",
    "lat": 47.3407,
    "long": 7.3183
  },
  {
    "zipCode": 2853,
    "city": "Courfaivre",
    "lat": 47.335,
    "long": 7.282
  },
  {
    "zipCode": 2854,
    "city": "Bassecourt",
    "lat": 47.3383,
    "long": 7.2449
  },
  {
    "zipCode": 2855,
    "city": "Glovelier",
    "lat": 47.3347,
    "long": 7.2054
  },
  {
    "zipCode": 2856,
    "city": "Boécourt",
    "lat": 47.3511,
    "long": 7.216
  },
  {
    "zipCode": 2857,
    "city": "Montavon",
    "lat": 47.3739,
    "long": 7.2369
  },
  {
    "zipCode": 2863,
    "city": "Undervelier",
    "lat": 47.3031,
    "long": 7.2227
  },
  {
    "zipCode": 2864,
    "city": "Soulce",
    "lat": 47.3043,
    "long": 7.2713
  },
  {
    "zipCode": 2873,
    "city": "Saulcy",
    "lat": 47.3024,
    "long": 7.154
  },
  {
    "zipCode": 2882,
    "city": "St-Ursanne",
    "lat": 47.2495,
    "long": 7.0172
  },
  {
    "zipCode": 2882,
    "city": "St-Ursanne",
    "lat": 47.3647,
    "long": 7.1544
  },
  {
    "zipCode": 2883,
    "city": "Montmelon",
    "lat": 47.3525,
    "long": 7.1779
  },
  {
    "zipCode": 2884,
    "city": "Montenol",
    "lat": 47.3518,
    "long": 7.1487
  },
  {
    "zipCode": 2885,
    "city": "Epauvillers",
    "lat": 47.3363,
    "long": 7.1194
  },
  {
    "zipCode": 2886,
    "city": "Epiquerez",
    "lat": 47.3318,
    "long": 7.0897
  },
  {
    "zipCode": 2887,
    "city": "Soubey",
    "lat": 47.3093,
    "long": 7.0489
  },
  {
    "zipCode": 2888,
    "city": "Seleute",
    "lat": 47.3667,
    "long": 7.1115
  },
  {
    "zipCode": 2889,
    "city": "Ocourt",
    "lat": 47.3522,
    "long": 7.0783
  },
  {
    "zipCode": 2900,
    "city": "Porrentruy",
    "lat": 47.4153,
    "long": 7.0752
  },
  {
    "zipCode": 2902,
    "city": "Fontenais",
    "lat": 47.4048,
    "long": 7.0819
  },
  {
    "zipCode": 2903,
    "city": "Villars-sur-Fontenais",
    "lat": 47.389,
    "long": 7.0811
  },
  {
    "zipCode": 2904,
    "city": "Bressaucourt",
    "lat": 47.3881,
    "long": 7.0352
  },
  {
    "zipCode": 2905,
    "city": "Courtedoux",
    "lat": 47.4082,
    "long": 7.0428
  },
  {
    "zipCode": 2906,
    "city": "Chevenez",
    "lat": 47.3917,
    "long": 7
  },
  {
    "zipCode": 2907,
    "city": "Rocourt",
    "lat": 47.3905,
    "long": 6.9566
  },
  {
    "zipCode": 2908,
    "city": "Grandfontaine",
    "lat": 47.3917,
    "long": 6.9395
  },
  {
    "zipCode": 2912,
    "city": "Réclère",
    "lat": 47.3756,
    "long": 6.919
  },
  {
    "zipCode": 2912,
    "city": "Roche-d'Or",
    "lat": 47.3665,
    "long": 6.9553
  },
  {
    "zipCode": 2914,
    "city": "Damvant",
    "lat": 47.3725,
    "long": 6.8973
  },
  {
    "zipCode": 2915,
    "city": "Bure",
    "lat": 47.4417,
    "long": 7.0075
  },
  {
    "zipCode": 2916,
    "city": "Fahy",
    "lat": 47.4182,
    "long": 6.95
  },
  {
    "zipCode": 2922,
    "city": "Courchavon",
    "lat": 47.4406,
    "long": 7.0584
  },
  {
    "zipCode": 2923,
    "city": "Courtemaîche",
    "lat": 47.4572,
    "long": 7.0483
  },
  {
    "zipCode": 2924,
    "city": "Montignez",
    "lat": 47.4871,
    "long": 7.0566
  },
  {
    "zipCode": 2925,
    "city": "Buix",
    "lat": 47.4811,
    "long": 7.0305
  },
  {
    "zipCode": 2926,
    "city": "Boncourt",
    "lat": 47.4956,
    "long": 7.0142
  },
  {
    "zipCode": 2932,
    "city": "Coeuve",
    "lat": 47.4529,
    "long": 7.0979
  },
  {
    "zipCode": 2933,
    "city": "Lugnez",
    "lat": 47.4851,
    "long": 7.0975
  },
  {
    "zipCode": 2933,
    "city": "Damphreux",
    "lat": 47.476,
    "long": 7.1069
  },
  {
    "zipCode": 2935,
    "city": "Beurnevésin",
    "lat": 47.4925,
    "long": 7.1337
  },
  {
    "zipCode": 2942,
    "city": "Alle",
    "lat": 47.4262,
    "long": 7.1291
  },
  {
    "zipCode": 2943,
    "city": "Vendlincourt",
    "lat": 47.4519,
    "long": 7.1469
  },
  {
    "zipCode": 2944,
    "city": "Bonfol",
    "lat": 47.4774,
    "long": 7.1514
  },
  {
    "zipCode": 2946,
    "city": "Miécourt",
    "lat": 47.4274,
    "long": 7.1759
  },
  {
    "zipCode": 2947,
    "city": "Charmoille",
    "lat": 47.4238,
    "long": 7.2076
  },
  {
    "zipCode": 2950,
    "city": "Courtemautruy",
    "lat": 47.396,
    "long": 7.1393
  },
  {
    "zipCode": 2950,
    "city": "Courgenay",
    "lat": 47.4036,
    "long": 7.1242
  },
  {
    "zipCode": 2952,
    "city": "Cornol",
    "lat": 47.4075,
    "long": 7.1625
  },
  {
    "zipCode": 2953,
    "city": "Pleujouse",
    "lat": 47.413,
    "long": 7.2108
  },
  {
    "zipCode": 2953,
    "city": "Fregiécourt",
    "lat": 47.4122,
    "long": 7.1985
  },
  {
    "zipCode": 2954,
    "city": "Asuel",
    "lat": 47.4036,
    "long": 7.2108
  },
  {
    "zipCode": 3000,
    "city": "Berne",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3001,
    "city": "Bern",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3002,
    "city": "Bern PostFinance",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3003,
    "city": "Bern",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3004,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3005,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3006,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3007,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3008,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3010,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3011,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3011,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3012,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3013,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3014,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3015,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3018,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3019,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3020,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3024,
    "city": "Bern",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3027,
    "city": "Bern",
    "lat": 46.9481,
    "long": 7.4474
  },
  {
    "zipCode": 3029,
    "city": "Bern",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3030,
    "city": "Bern",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3032,
    "city": "Hinterkappelen",
    "lat": 46.9673,
    "long": 7.3779
  },
  {
    "zipCode": 3033,
    "city": "Wohlen b. Bern",
    "lat": 46.9877,
    "long": 7.3481
  },
  {
    "zipCode": 3034,
    "city": "Murzelen",
    "lat": 46.9831,
    "long": 7.3155
  },
  {
    "zipCode": 3035,
    "city": "Frieswil",
    "lat": 46.9951,
    "long": 7.2866
  },
  {
    "zipCode": 3036,
    "city": "Detligen",
    "lat": 47.0031,
    "long": 7.2736
  },
  {
    "zipCode": 3037,
    "city": "Herrenschwanden",
    "lat": 46.9776,
    "long": 7.4175
  },
  {
    "zipCode": 3038,
    "city": "Kirchlindach",
    "lat": 46.9997,
    "long": 7.4173
  },
  {
    "zipCode": 3039,
    "city": "Bern PF OC",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3040,
    "city": "Bern Verarb.zentr.",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3041,
    "city": "Bern UBS",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3042,
    "city": "Ortschwaben",
    "lat": 46.9917,
    "long": 7.4018
  },
  {
    "zipCode": 3043,
    "city": "Uettligen",
    "lat": 46.9873,
    "long": 7.3856
  },
  {
    "zipCode": 3044,
    "city": "Innerberg",
    "lat": 46.9975,
    "long": 7.3073
  },
  {
    "zipCode": 3045,
    "city": "Meikirch",
    "lat": 47.0072,
    "long": 7.3664
  },
  {
    "zipCode": 3046,
    "city": "Wahlendorf",
    "lat": 47.0091,
    "long": 7.3388
  },
  {
    "zipCode": 3047,
    "city": "Bremgarten b. Bern",
    "lat": 46.978,
    "long": 7.4385
  },
  {
    "zipCode": 3048,
    "city": "Worblaufen",
    "lat": 46.9797,
    "long": 7.4581
  },
  {
    "zipCode": 3049,
    "city": "Säriswil",
    "lat": 46.9918,
    "long": 7.3342
  },
  {
    "zipCode": 3050,
    "city": "Bern Swisscom",
    "lat": 46.9476,
    "long": 7.4065
  },
  {
    "zipCode": 3052,
    "city": "Zollikofen",
    "lat": 46.999,
    "long": 7.4581
  },
  {
    "zipCode": 3053,
    "city": "Lätti",
    "lat": 47.0378,
    "long": 7.4322
  },
  {
    "zipCode": 3053,
    "city": "Diemerswil",
    "lat": 47.0191,
    "long": 7.4245
  },
  {
    "zipCode": 3053,
    "city": "Wiggiswil",
    "lat": 47.0313,
    "long": 7.4709
  },
  {
    "zipCode": 3053,
    "city": "Deisswil b. Münchenbuchsee",
    "lat": 47.0372,
    "long": 7.4533
  },
  {
    "zipCode": 3053,
    "city": "Münchenbuchsee",
    "lat": 47.0218,
    "long": 7.4504
  },
  {
    "zipCode": 3054,
    "city": "Schüpfen",
    "lat": 47.0366,
    "long": 7.3772
  },
  {
    "zipCode": 3063,
    "city": "Ittigen",
    "lat": 46.9743,
    "long": 7.4828
  },
  {
    "zipCode": 3065,
    "city": "Bolligen",
    "lat": 46.9751,
    "long": 7.497
  },
  {
    "zipCode": 3066,
    "city": "Stettlen",
    "lat": 46.9583,
    "long": 7.5251
  },
  {
    "zipCode": 3067,
    "city": "Boll",
    "lat": 46.9542,
    "long": 7.5486
  },
  {
    "zipCode": 3068,
    "city": "Utzigen",
    "lat": 46.9621,
    "long": 7.5657
  },
  {
    "zipCode": 3071,
    "city": "Ostermundigen KATA",
    "lat": 46.9559,
    "long": 7.4956
  },
  {
    "zipCode": 3072,
    "city": "Ostermundigen",
    "lat": 46.9569,
    "long": 7.4902
  },
  {
    "zipCode": 3073,
    "city": "Gümligen",
    "lat": 46.9345,
    "long": 7.5093
  },
  {
    "zipCode": 3074,
    "city": "Muri b. Bern",
    "lat": 46.9312,
    "long": 7.4866
  },
  {
    "zipCode": 3075,
    "city": "Rüfenacht BE",
    "lat": 46.9308,
    "long": 7.5323
  },
  {
    "zipCode": 3075,
    "city": "Vielbringen b. Worb",
    "lat": 46.9308,
    "long": 7.5323
  },
  {
    "zipCode": 3076,
    "city": "Worb",
    "lat": 46.9298,
    "long": 7.5631
  },
  {
    "zipCode": 3077,
    "city": "Enggistein",
    "lat": 46.9335,
    "long": 7.5979
  },
  {
    "zipCode": 3078,
    "city": "Richigen",
    "lat": 46.9173,
    "long": 7.5842
  },
  {
    "zipCode": 3082,
    "city": "Schlosswil",
    "lat": 46.9087,
    "long": 7.6117
  },
  {
    "zipCode": 3083,
    "city": "Trimstein",
    "lat": 46.9048,
    "long": 7.5835
  },
  {
    "zipCode": 3084,
    "city": "Wabern",
    "lat": 46.9299,
    "long": 7.4508
  },
  {
    "zipCode": 3085,
    "city": "Wabern Weihnachten",
    "lat": 46.9043,
    "long": 7.3978
  },
  {
    "zipCode": 3086,
    "city": "Englisberg",
    "lat": 46.8992,
    "long": 7.4693
  },
  {
    "zipCode": 3086,
    "city": "Zimmerwald",
    "lat": 46.8809,
    "long": 7.4771
  },
  {
    "zipCode": 3087,
    "city": "Niedermuhlern",
    "lat": 46.8576,
    "long": 7.4618
  },
  {
    "zipCode": 3088,
    "city": "Rüeggisberg",
    "lat": 46.8222,
    "long": 7.4389
  },
  {
    "zipCode": 3088,
    "city": "Oberbütschel",
    "lat": 46.8389,
    "long": 7.4641
  },
  {
    "zipCode": 3089,
    "city": "Hinterfultigen",
    "lat": 46.8398,
    "long": 7.4009
  },
  {
    "zipCode": 3095,
    "city": "Spiegel b. Bern",
    "lat": 46.9248,
    "long": 7.4361
  },
  {
    "zipCode": 3096,
    "city": "Oberbalm",
    "lat": 46.8736,
    "long": 7.4028
  },
  {
    "zipCode": 3097,
    "city": "Liebefeld",
    "lat": 46.9258,
    "long": 7.4145
  },
  {
    "zipCode": 3098,
    "city": "Köniz",
    "lat": 46.9244,
    "long": 7.4146
  },
  {
    "zipCode": 3098,
    "city": "Schliern b. Köniz",
    "lat": 46.9244,
    "long": 7.4146
  },
  {
    "zipCode": 3099,
    "city": "Rüti b. Riggisberg",
    "lat": 46.7824,
    "long": 7.4602
  },
  {
    "zipCode": 3110,
    "city": "Münsingen",
    "lat": 46.873,
    "long": 7.561
  },
  {
    "zipCode": 3111,
    "city": "Tägertschi",
    "lat": 46.8841,
    "long": 7.5657
  },
  {
    "zipCode": 3112,
    "city": "Allmendingen b. Bern",
    "lat": 46.9147,
    "long": 7.5244
  },
  {
    "zipCode": 3113,
    "city": "Rubigen",
    "lat": 46.8987,
    "long": 7.5446
  },
  {
    "zipCode": 3114,
    "city": "Wichtrach",
    "lat": 46.8501,
    "long": 7.5775
  },
  {
    "zipCode": 3115,
    "city": "Gerzensee",
    "lat": 46.8402,
    "long": 7.545
  },
  {
    "zipCode": 3116,
    "city": "Mühledorf BE",
    "lat": 46.828,
    "long": 7.5299
  },
  {
    "zipCode": 3116,
    "city": "Noflen BE",
    "lat": 46.8056,
    "long": 7.5433
  },
  {
    "zipCode": 3116,
    "city": "Kirchdorf BE",
    "lat": 46.8209,
    "long": 7.5485
  },
  {
    "zipCode": 3122,
    "city": "Kehrsatz",
    "lat": 46.9103,
    "long": 7.471
  },
  {
    "zipCode": 3123,
    "city": "Belp",
    "lat": 46.8913,
    "long": 7.4983
  },
  {
    "zipCode": 3124,
    "city": "Belpberg",
    "lat": 46.8673,
    "long": 7.5213
  },
  {
    "zipCode": 3125,
    "city": "Toffen",
    "lat": 46.8603,
    "long": 7.4922
  },
  {
    "zipCode": 3126,
    "city": "Kaufdorf",
    "lat": 46.8403,
    "long": 7.4968
  },
  {
    "zipCode": 3126,
    "city": "Gelterfingen",
    "lat": 46.8445,
    "long": 7.5156
  },
  {
    "zipCode": 3127,
    "city": "Lohnstorf",
    "lat": 46.8077,
    "long": 7.5099
  },
  {
    "zipCode": 3127,
    "city": "Mühlethurnen",
    "lat": 46.8135,
    "long": 7.5088
  },
  {
    "zipCode": 3128,
    "city": "Rümligen",
    "lat": 46.8217,
    "long": 7.4772
  },
  {
    "zipCode": 3128,
    "city": "Kirchenthurnen",
    "lat": 46.8238,
    "long": 7.5005
  },
  {
    "zipCode": 3132,
    "city": "Riggisberg",
    "lat": 46.8103,
    "long": 7.4801
  },
  {
    "zipCode": 3144,
    "city": "Gasel",
    "lat": 46.9022,
    "long": 7.4018
  },
  {
    "zipCode": 3145,
    "city": "Niederscherli",
    "lat": 46.8851,
    "long": 7.3938
  },
  {
    "zipCode": 3147,
    "city": "Mittelhäusern",
    "lat": 46.8778,
    "long": 7.3691
  },
  {
    "zipCode": 3148,
    "city": "Lanzenhäusern",
    "lat": 46.8436,
    "long": 7.349
  },
  {
    "zipCode": 3150,
    "city": "Schwarzenburg",
    "lat": 46.8181,
    "long": 7.3421
  },
  {
    "zipCode": 3152,
    "city": "Mamishaus",
    "lat": 46.8101,
    "long": 7.3796
  },
  {
    "zipCode": 3153,
    "city": "Rüschegg Gambach",
    "lat": 46.7789,
    "long": 7.3786
  },
  {
    "zipCode": 3154,
    "city": "Rüschegg Heubach",
    "lat": 46.7832,
    "long": 7.4083
  },
  {
    "zipCode": 3155,
    "city": "Helgisried-Rohrbach",
    "lat": 46.8176,
    "long": 7.4284
  },
  {
    "zipCode": 3156,
    "city": "Riffenmatt",
    "lat": 46.7662,
    "long": 7.3529
  },
  {
    "zipCode": 3157,
    "city": "Milken",
    "lat": 46.7937,
    "long": 7.359
  },
  {
    "zipCode": 3158,
    "city": "Guggisberg",
    "lat": 46.7676,
    "long": 7.3295
  },
  {
    "zipCode": 3159,
    "city": "Riedstätt",
    "lat": 46.7841,
    "long": 7.3194
  },
  {
    "zipCode": 3172,
    "city": "Niederwangen b. Bern",
    "lat": 46.9043,
    "long": 7.3977
  },
  {
    "zipCode": 3173,
    "city": "Oberwangen b. Bern",
    "lat": 46.9043,
    "long": 7.3977
  },
  {
    "zipCode": 3174,
    "city": "Thörishaus",
    "lat": 46.8939,
    "long": 7.3513
  },
  {
    "zipCode": 3175,
    "city": "Flamatt",
    "lat": 46.8899,
    "long": 7.322
  },
  {
    "zipCode": 3176,
    "city": "Neuenegg",
    "lat": 46.8949,
    "long": 7.3047
  },
  {
    "zipCode": 3177,
    "city": "Laupen BE",
    "lat": 46.9021,
    "long": 7.2397
  },
  {
    "zipCode": 3178,
    "city": "Bösingen",
    "lat": 46.8923,
    "long": 7.2277
  },
  {
    "zipCode": 3179,
    "city": "Kriechenwil",
    "lat": 46.9097,
    "long": 7.2196
  },
  {
    "zipCode": 3182,
    "city": "Ueberstorf",
    "lat": 46.8659,
    "long": 7.31
  },
  {
    "zipCode": 3183,
    "city": "Albligen",
    "lat": 46.8523,
    "long": 7.3181
  },
  {
    "zipCode": 3184,
    "city": "Wünnewil",
    "lat": 46.874,
    "long": 7.2773
  },
  {
    "zipCode": 3185,
    "city": "Schmitten FR",
    "lat": 46.8575,
    "long": 7.2503
  },
  {
    "zipCode": 3186,
    "city": "Düdingen",
    "lat": 46.8492,
    "long": 7.1885
  },
  {
    "zipCode": 3202,
    "city": "Frauenkappelen",
    "lat": 46.9542,
    "long": 7.3384
  },
  {
    "zipCode": 3203,
    "city": "Mühleberg",
    "lat": 46.9547,
    "long": 7.261
  },
  {
    "zipCode": 3204,
    "city": "Rosshäusern",
    "lat": 46.9332,
    "long": 7.2762
  },
  {
    "zipCode": 3205,
    "city": "Gümmenen",
    "lat": 46.9456,
    "long": 7.2409
  },
  {
    "zipCode": 3206,
    "city": "Ferenbalm",
    "lat": 46.9488,
    "long": 7.2112
  },
  {
    "zipCode": 3206,
    "city": "Gammen",
    "lat": 46.9208,
    "long": 7.228
  },
  {
    "zipCode": 3206,
    "city": "Rizenbach",
    "lat": 46.944,
    "long": 7.2232
  },
  {
    "zipCode": 3206,
    "city": "Biberen",
    "lat": 46.9404,
    "long": 7.213
  },
  {
    "zipCode": 3206,
    "city": "Wallenbuch",
    "lat": 46.9295,
    "long": 7.2254
  },
  {
    "zipCode": 3207,
    "city": "Wileroltigen",
    "lat": 46.9709,
    "long": 7.2392
  },
  {
    "zipCode": 3207,
    "city": "Golaten",
    "lat": 46.9844,
    "long": 7.2352
  },
  {
    "zipCode": 3208,
    "city": "Gurbrü",
    "lat": 46.9648,
    "long": 7.2153
  },
  {
    "zipCode": 3210,
    "city": "Kerzers",
    "lat": 46.9759,
    "long": 7.1957
  },
  {
    "zipCode": 3212,
    "city": "Kleingurmels",
    "lat": 46.8862,
    "long": 7.1874
  },
  {
    "zipCode": 3212,
    "city": "Gurmels",
    "lat": 46.8941,
    "long": 7.1719
  },
  {
    "zipCode": 3213,
    "city": "Liebistorf",
    "lat": 46.9088,
    "long": 7.1964
  },
  {
    "zipCode": 3213,
    "city": "Kleinbösingen",
    "lat": 46.893,
    "long": 7.2024
  },
  {
    "zipCode": 3214,
    "city": "Ulmiz",
    "lat": 46.9319,
    "long": 7.1978
  },
  {
    "zipCode": 3215,
    "city": "Gempenach",
    "lat": 46.943,
    "long": 7.1992
  },
  {
    "zipCode": 3215,
    "city": "Lurtigen",
    "lat": 46.9284,
    "long": 7.1733
  },
  {
    "zipCode": 3215,
    "city": "Büchslen",
    "lat": 46.9459,
    "long": 7.1816
  },
  {
    "zipCode": 3216,
    "city": "Agriswil",
    "lat": 46.9555,
    "long": 7.1978
  },
  {
    "zipCode": 3216,
    "city": "Ried b. Kerzers",
    "lat": 46.9555,
    "long": 7.1978
  },
  {
    "zipCode": 3225,
    "city": "Müntschemier",
    "lat": 46.9955,
    "long": 7.1463
  },
  {
    "zipCode": 3226,
    "city": "Treiten",
    "lat": 47.0086,
    "long": 7.1603
  },
  {
    "zipCode": 3232,
    "city": "Ins",
    "lat": 47.0058,
    "long": 7.1061
  },
  {
    "zipCode": 3233,
    "city": "Tschugg",
    "lat": 47.0253,
    "long": 7.081
  },
  {
    "zipCode": 3234,
    "city": "Vinelz",
    "lat": 47.034,
    "long": 7.1161
  },
  {
    "zipCode": 3235,
    "city": "Erlach",
    "lat": 47.0422,
    "long": 7.0973
  },
  {
    "zipCode": 3236,
    "city": "Gampelen",
    "lat": 47.012,
    "long": 7.0577
  },
  {
    "zipCode": 3237,
    "city": "Brüttelen",
    "lat": 47.0227,
    "long": 7.1479
  },
  {
    "zipCode": 3238,
    "city": "Gals",
    "lat": 47.0284,
    "long": 7.0518
  },
  {
    "zipCode": 3250,
    "city": "Lyss",
    "lat": 47.0741,
    "long": 7.3066
  },
  {
    "zipCode": 3251,
    "city": "Ruppoldsried",
    "lat": 47.0891,
    "long": 7.4265
  },
  {
    "zipCode": 3251,
    "city": "Wengi b. Büren",
    "lat": 47.0862,
    "long": 7.3954
  },
  {
    "zipCode": 3252,
    "city": "Worben",
    "lat": 47.1028,
    "long": 7.2952
  },
  {
    "zipCode": 3253,
    "city": "Schnottwil",
    "lat": 47.1117,
    "long": 7.3937
  },
  {
    "zipCode": 3254,
    "city": "Balm b. Messen",
    "lat": 47.0913,
    "long": 7.4496
  },
  {
    "zipCode": 3254,
    "city": "Messen",
    "lat": 47.0913,
    "long": 7.4496
  },
  {
    "zipCode": 3255,
    "city": "Rapperswil BE",
    "lat": 47.0632,
    "long": 7.4109
  },
  {
    "zipCode": 3256,
    "city": "Seewil",
    "lat": 47.0495,
    "long": 7.4098
  },
  {
    "zipCode": 3256,
    "city": "Dieterswil",
    "lat": 47.0565,
    "long": 7.4259
  },
  {
    "zipCode": 3256,
    "city": "Bangerten b. Dieterswil",
    "lat": 47.053,
    "long": 7.4178
  },
  {
    "zipCode": 3257,
    "city": "Grossaffoltern",
    "lat": 47.0659,
    "long": 7.3623
  },
  {
    "zipCode": 3257,
    "city": "Ammerzwil BE",
    "lat": 47.0704,
    "long": 7.3418
  },
  {
    "zipCode": 3262,
    "city": "Suberg",
    "lat": 47.061,
    "long": 7.3373
  },
  {
    "zipCode": 3263,
    "city": "Büetigen",
    "lat": 47.106,
    "long": 7.338
  },
  {
    "zipCode": 3264,
    "city": "Diessbach b. Büren",
    "lat": 47.1078,
    "long": 7.3612
  },
  {
    "zipCode": 3266,
    "city": "Wiler b. Seedorf",
    "lat": 47.0499,
    "long": 7.321
  },
  {
    "zipCode": 3267,
    "city": "Seedorf BE",
    "lat": 47.0345,
    "long": 7.3125
  },
  {
    "zipCode": 3268,
    "city": "Lobsigen",
    "lat": 47.0282,
    "long": 7.2945
  },
  {
    "zipCode": 3270,
    "city": "Aarberg",
    "lat": 47.0444,
    "long": 7.2758
  },
  {
    "zipCode": 3271,
    "city": "Radelfingen b. Aarberg",
    "lat": 47.0215,
    "long": 7.2718
  },
  {
    "zipCode": 3272,
    "city": "Walperswil",
    "lat": 47.0602,
    "long": 7.2296
  },
  {
    "zipCode": 3272,
    "city": "Epsach",
    "lat": 47.0705,
    "long": 7.2217
  },
  {
    "zipCode": 3273,
    "city": "Kappelen",
    "lat": 47.0602,
    "long": 7.2686
  },
  {
    "zipCode": 3274,
    "city": "Bühl b. Aarberg",
    "lat": 47.0708,
    "long": 7.2454
  },
  {
    "zipCode": 3274,
    "city": "Hermrigen",
    "lat": 47.0817,
    "long": 7.2416
  },
  {
    "zipCode": 3274,
    "city": "Merzligen",
    "lat": 47.0873,
    "long": 7.2538
  },
  {
    "zipCode": 3280,
    "city": "Murten",
    "lat": 46.9283,
    "long": 7.1171
  },
  {
    "zipCode": 3280,
    "city": "Greng",
    "lat": 46.9134,
    "long": 7.094
  },
  {
    "zipCode": 3280,
    "city": "Meyriez",
    "lat": 46.9237,
    "long": 7.1066
  },
  {
    "zipCode": 3282,
    "city": "Bargen BE",
    "lat": 47.0375,
    "long": 7.2629
  },
  {
    "zipCode": 3283,
    "city": "Niederried b. Kallnach",
    "lat": 47.0112,
    "long": 7.2501
  },
  {
    "zipCode": 3283,
    "city": "Kallnach",
    "lat": 47.0203,
    "long": 7.2355
  },
  {
    "zipCode": 3284,
    "city": "Fräschels",
    "lat": 46.9979,
    "long": 7.2081
  },
  {
    "zipCode": 3285,
    "city": "Galmiz",
    "lat": 46.9488,
    "long": 7.158
  },
  {
    "zipCode": 3286,
    "city": "Muntelier",
    "lat": 46.9352,
    "long": 7.1236
  },
  {
    "zipCode": 3292,
    "city": "Busswil BE",
    "lat": 47.0997,
    "long": 7.3222
  },
  {
    "zipCode": 3293,
    "city": "Dotzigen",
    "lat": 47.1217,
    "long": 7.3456
  },
  {
    "zipCode": 3294,
    "city": "Meienried",
    "lat": 47.1387,
    "long": 7.3414
  },
  {
    "zipCode": 3294,
    "city": "Büren an der Aare",
    "lat": 47.1398,
    "long": 7.3722
  },
  {
    "zipCode": 3295,
    "city": "Rüti b. Büren",
    "lat": 47.1513,
    "long": 7.4113
  },
  {
    "zipCode": 3296,
    "city": "Arch",
    "lat": 47.1653,
    "long": 7.4314
  },
  {
    "zipCode": 3297,
    "city": "Leuzigen",
    "lat": 47.1746,
    "long": 7.4578
  },
  {
    "zipCode": 3298,
    "city": "Oberwil b. Büren",
    "lat": 47.1307,
    "long": 7.4114
  },
  {
    "zipCode": 3302,
    "city": "Moosseedorf",
    "lat": 47.0168,
    "long": 7.4839
  },
  {
    "zipCode": 3303,
    "city": "Zuzwil BE",
    "lat": 47.0511,
    "long": 7.4681
  },
  {
    "zipCode": 3303,
    "city": "Münchringen",
    "lat": 47.0477,
    "long": 7.5247
  },
  {
    "zipCode": 3303,
    "city": "Jegenstorf",
    "lat": 47.048,
    "long": 7.5079
  },
  {
    "zipCode": 3303,
    "city": "Ballmoos",
    "lat": 47.0405,
    "long": 7.4759
  },
  {
    "zipCode": 3305,
    "city": "Iffwil",
    "lat": 47.064,
    "long": 7.4829
  },
  {
    "zipCode": 3305,
    "city": "Scheunen",
    "lat": 47.0693,
    "long": 7.4583
  },
  {
    "zipCode": 3306,
    "city": "Etzelkofen",
    "lat": 47.0845,
    "long": 7.4806
  },
  {
    "zipCode": 3307,
    "city": "Brunnenthal",
    "lat": 47.0867,
    "long": 7.4686
  },
  {
    "zipCode": 3308,
    "city": "Grafenried",
    "lat": 47.0765,
    "long": 7.5147
  },
  {
    "zipCode": 3309,
    "city": "Kernenried",
    "lat": 47.0697,
    "long": 7.5468
  },
  {
    "zipCode": 3309,
    "city": "Zauggenried",
    "lat": 47.0727,
    "long": 7.5355
  },
  {
    "zipCode": 3312,
    "city": "Fraubrunnen",
    "lat": 47.0862,
    "long": 7.5273
  },
  {
    "zipCode": 3313,
    "city": "Büren zum Hof",
    "lat": 47.0977,
    "long": 7.5135
  },
  {
    "zipCode": 3314,
    "city": "Schalunen",
    "lat": 47.1105,
    "long": 7.5263
  },
  {
    "zipCode": 3315,
    "city": "Bätterkinden",
    "lat": 47.1336,
    "long": 7.541
  },
  {
    "zipCode": 3315,
    "city": "Kräiligen",
    "lat": 47.1504,
    "long": 7.5343
  },
  {
    "zipCode": 3317,
    "city": "Limpach",
    "lat": 47.1077,
    "long": 7.4979
  },
  {
    "zipCode": 3317,
    "city": "Mülchi",
    "lat": 47.1018,
    "long": 7.4736
  },
  {
    "zipCode": 3321,
    "city": "Schönbühl EKZ",
    "lat": 47.0168,
    "long": 7.4839
  },
  {
    "zipCode": 3322,
    "city": "Mattstetten",
    "lat": 47.0282,
    "long": 7.5189
  },
  {
    "zipCode": 3322,
    "city": "Urtenen-Schönbühl",
    "lat": 47.0209,
    "long": 7.4999
  },
  {
    "zipCode": 3323,
    "city": "Bäriswil BE",
    "lat": 47.0195,
    "long": 7.5271
  },
  {
    "zipCode": 3324,
    "city": "Hindelbank",
    "lat": 47.0427,
    "long": 7.5414
  },
  {
    "zipCode": 3324,
    "city": "Mötschwil",
    "lat": 47.0411,
    "long": 7.5756
  },
  {
    "zipCode": 3325,
    "city": "Hettiswil b. Hindelbank",
    "lat": 47.027,
    "long": 7.5382
  },
  {
    "zipCode": 3326,
    "city": "Krauchthal",
    "lat": 47.0096,
    "long": 7.5664
  },
  {
    "zipCode": 3360,
    "city": "Herzogenbuchsee",
    "lat": 47.1879,
    "long": 7.7062
  },
  {
    "zipCode": 3362,
    "city": "Niederönz",
    "lat": 47.1842,
    "long": 7.6906
  },
  {
    "zipCode": 3363,
    "city": "Oberönz",
    "lat": 47.1779,
    "long": 7.6949
  },
  {
    "zipCode": 3365,
    "city": "Grasswil",
    "lat": 47.1441,
    "long": 7.6701
  },
  {
    "zipCode": 3365,
    "city": "Seeberg",
    "lat": 47.1559,
    "long": 7.6657
  },
  {
    "zipCode": 3366,
    "city": "Bettenhausen",
    "lat": 47.1715,
    "long": 7.7157
  },
  {
    "zipCode": 3366,
    "city": "Bollodingen",
    "lat": 47.1662,
    "long": 7.7056
  },
  {
    "zipCode": 3367,
    "city": "Ochlenberg",
    "lat": 47.1495,
    "long": 7.736
  },
  {
    "zipCode": 3367,
    "city": "Thörigen",
    "lat": 47.1731,
    "long": 7.7289
  },
  {
    "zipCode": 3368,
    "city": "Bleienbach",
    "lat": 47.1849,
    "long": 7.7563
  },
  {
    "zipCode": 3372,
    "city": "Wanzwil",
    "lat": 47.2003,
    "long": 7.6932
  },
  {
    "zipCode": 3373,
    "city": "Röthenbach Herzogenbuchsee",
    "lat": 47.2064,
    "long": 7.6816
  },
  {
    "zipCode": 3373,
    "city": "Heimenhausen",
    "lat": 47.209,
    "long": 7.6996
  },
  {
    "zipCode": 3374,
    "city": "Wangenried",
    "lat": 47.2171,
    "long": 7.6556
  },
  {
    "zipCode": 3375,
    "city": "Inkwil",
    "lat": 47.201,
    "long": 7.6712
  },
  {
    "zipCode": 3376,
    "city": "Graben",
    "lat": 47.2153,
    "long": 7.7178
  },
  {
    "zipCode": 3376,
    "city": "Berken",
    "lat": 47.2258,
    "long": 7.7059
  },
  {
    "zipCode": 3377,
    "city": "Walliswil b. Wangen",
    "lat": 47.2288,
    "long": 7.6829
  },
  {
    "zipCode": 3380,
    "city": "Wangen an der Aare",
    "lat": 47.232,
    "long": 7.6545
  },
  {
    "zipCode": 3380,
    "city": "Walliswil b. Niederbipp",
    "lat": 47.2362,
    "long": 7.6953
  },
  {
    "zipCode": 3400,
    "city": "Burgdorf",
    "lat": 47.059,
    "long": 7.6279
  },
  {
    "zipCode": 3401,
    "city": "Burgdorf",
    "lat": 47.0537,
    "long": 7.6191
  },
  {
    "zipCode": 3412,
    "city": "Heimiswil",
    "lat": 47.0675,
    "long": 7.6667
  },
  {
    "zipCode": 3413,
    "city": "Kaltacker",
    "lat": 47.0778,
    "long": 7.6701
  },
  {
    "zipCode": 3414,
    "city": "Oberburg",
    "lat": 47.0366,
    "long": 7.6275
  },
  {
    "zipCode": 3415,
    "city": "Rüegsauschachen",
    "lat": 47.0205,
    "long": 7.6644
  },
  {
    "zipCode": 3415,
    "city": "Schafhausen im Emmental",
    "lat": 47.0174,
    "long": 7.6577
  },
  {
    "zipCode": 3415,
    "city": "Hasle b. Burgdorf",
    "lat": 47.0144,
    "long": 7.6511
  },
  {
    "zipCode": 3416,
    "city": "Affoltern im Emmental",
    "lat": 47.0653,
    "long": 7.7347
  },
  {
    "zipCode": 3417,
    "city": "Rüegsau",
    "lat": 47.0381,
    "long": 7.691
  },
  {
    "zipCode": 3418,
    "city": "Rüegsbach",
    "lat": 47.0354,
    "long": 7.6903
  },
  {
    "zipCode": 3419,
    "city": "Biembach im Emmental",
    "lat": 47.0006,
    "long": 7.6224
  },
  {
    "zipCode": 3421,
    "city": "Lyssach",
    "lat": 47.0645,
    "long": 7.5823
  },
  {
    "zipCode": 3421,
    "city": "Rüti b. Lyssach",
    "lat": 47.0544,
    "long": 7.5824
  },
  {
    "zipCode": 3421,
    "city": "Lyssach",
    "lat": 47.023,
    "long": 7.6065
  },
  {
    "zipCode": 3422,
    "city": "Rüdtligen",
    "lat": 47.0887,
    "long": 7.5707
  },
  {
    "zipCode": 3422,
    "city": "Kirchberg BE",
    "lat": 47.0854,
    "long": 7.5829
  },
  {
    "zipCode": 3422,
    "city": "Alchenflüh",
    "lat": 47.0847,
    "long": 7.5811
  },
  {
    "zipCode": 3423,
    "city": "Ersigen",
    "lat": 47.0937,
    "long": 7.5951
  },
  {
    "zipCode": 3424,
    "city": "Niederösch",
    "lat": 47.0976,
    "long": 7.6042
  },
  {
    "zipCode": 3424,
    "city": "Oberösch",
    "lat": 47.1096,
    "long": 7.608
  },
  {
    "zipCode": 3425,
    "city": "Willadingen",
    "lat": 47.1467,
    "long": 7.6111
  },
  {
    "zipCode": 3425,
    "city": "Koppigen",
    "lat": 47.1338,
    "long": 7.5987
  },
  {
    "zipCode": 3426,
    "city": "Aefligen",
    "lat": 47.0957,
    "long": 7.5517
  },
  {
    "zipCode": 3427,
    "city": "Utzenstorf",
    "lat": 47.1298,
    "long": 7.5584
  },
  {
    "zipCode": 3428,
    "city": "Wiler b. Utzenstorf",
    "lat": 47.1506,
    "long": 7.5566
  },
  {
    "zipCode": 3429,
    "city": "Höchstetten",
    "lat": 47.1438,
    "long": 7.6334
  },
  {
    "zipCode": 3429,
    "city": "Hellsau",
    "lat": 47.1437,
    "long": 7.6483
  },
  {
    "zipCode": 3432,
    "city": "Lützelflüh-Goldbach",
    "lat": 47.0076,
    "long": 7.6917
  },
  {
    "zipCode": 3433,
    "city": "Schwanden im Emmental",
    "lat": 46.988,
    "long": 7.6952
  },
  {
    "zipCode": 3434,
    "city": "Obergoldbach",
    "lat": 46.962,
    "long": 7.6739
  },
  {
    "zipCode": 3434,
    "city": "Landiswil",
    "lat": 46.9582,
    "long": 7.6803
  },
  {
    "zipCode": 3435,
    "city": "Ramsei",
    "lat": 46.9983,
    "long": 7.7118
  },
  {
    "zipCode": 3436,
    "city": "Zollbrück",
    "lat": 46.9745,
    "long": 7.7438
  },
  {
    "zipCode": 3437,
    "city": "Rüderswil",
    "lat": 46.9837,
    "long": 7.7217
  },
  {
    "zipCode": 3438,
    "city": "Lauperswil",
    "lat": 46.9656,
    "long": 7.7421
  },
  {
    "zipCode": 3439,
    "city": "Ranflüh",
    "lat": 46.9876,
    "long": 7.7402
  },
  {
    "zipCode": 3452,
    "city": "Grünenmatt",
    "lat": 47.009,
    "long": 7.7234
  },
  {
    "zipCode": 3453,
    "city": "Heimisbach",
    "lat": 47.0125,
    "long": 7.7605
  },
  {
    "zipCode": 3454,
    "city": "Sumiswald",
    "lat": 47.0275,
    "long": 7.7453
  },
  {
    "zipCode": 3455,
    "city": "Grünen",
    "lat": 47.0266,
    "long": 7.7432
  },
  {
    "zipCode": 3456,
    "city": "Trachselwald",
    "lat": 47.017,
    "long": 7.7364
  },
  {
    "zipCode": 3457,
    "city": "Wasen im Emmental",
    "lat": 47.0427,
    "long": 7.7972
  },
  {
    "zipCode": 3462,
    "city": "Weier im Emmental",
    "lat": 47.0624,
    "long": 7.7506
  },
  {
    "zipCode": 3463,
    "city": "Häusernmoos im Emmental",
    "lat": 47.0807,
    "long": 7.7502
  },
  {
    "zipCode": 3464,
    "city": "Schmidigen-Mühleweg",
    "lat": 47.0943,
    "long": 7.7459
  },
  {
    "zipCode": 3465,
    "city": "Dürrenroth",
    "lat": 47.0882,
    "long": 7.7913
  },
  {
    "zipCode": 3472,
    "city": "Rumendingen",
    "lat": 47.1059,
    "long": 7.6394
  },
  {
    "zipCode": 3472,
    "city": "Wynigen",
    "lat": 47.1059,
    "long": 7.6668
  },
  {
    "zipCode": 3473,
    "city": "Alchenstorf",
    "lat": 47.1254,
    "long": 7.6379
  },
  {
    "zipCode": 3474,
    "city": "Rüedisbach",
    "lat": 47.1208,
    "long": 7.7044
  },
  {
    "zipCode": 3475,
    "city": "Hermiswil",
    "lat": 47.1422,
    "long": 7.683
  },
  {
    "zipCode": 3475,
    "city": "Riedtwil",
    "lat": 47.1437,
    "long": 7.6982
  },
  {
    "zipCode": 3476,
    "city": "Oschwand",
    "lat": 47.1408,
    "long": 7.7129
  },
  {
    "zipCode": 3503,
    "city": "Gysenstein",
    "lat": 46.8915,
    "long": 7.5924
  },
  {
    "zipCode": 3504,
    "city": "Niederhünigen",
    "lat": 46.879,
    "long": 7.6386
  },
  {
    "zipCode": 3504,
    "city": "Oberhünigen",
    "lat": 46.881,
    "long": 7.6598
  },
  {
    "zipCode": 3506,
    "city": "Grosshöchstetten",
    "lat": 46.9067,
    "long": 7.6378
  },
  {
    "zipCode": 3507,
    "city": "Biglen",
    "lat": 46.9263,
    "long": 7.6251
  },
  {
    "zipCode": 3508,
    "city": "Arni BE",
    "lat": 46.9352,
    "long": 7.6647
  },
  {
    "zipCode": 3510,
    "city": "Konolfingen",
    "lat": 46.8791,
    "long": 7.6201
  },
  {
    "zipCode": 3510,
    "city": "Freimettigen",
    "lat": 46.8664,
    "long": 7.6311
  },
  {
    "zipCode": 3510,
    "city": "Häutligen",
    "lat": 46.8576,
    "long": 7.6067
  },
  {
    "zipCode": 3512,
    "city": "Walkringen",
    "lat": 46.9486,
    "long": 7.6204
  },
  {
    "zipCode": 3513,
    "city": "Bigenthal",
    "lat": 46.9661,
    "long": 7.624
  },
  {
    "zipCode": 3531,
    "city": "Oberthal",
    "lat": 46.9184,
    "long": 7.6781
  },
  {
    "zipCode": 3532,
    "city": "Zäziwil",
    "lat": 46.902,
    "long": 7.6618
  },
  {
    "zipCode": 3532,
    "city": "Mirchel",
    "lat": 46.8946,
    "long": 7.6499
  },
  {
    "zipCode": 3533,
    "city": "Bowil",
    "lat": 46.893,
    "long": 7.6976
  },
  {
    "zipCode": 3534,
    "city": "Signau",
    "lat": 46.9194,
    "long": 7.7242
  },
  {
    "zipCode": 3535,
    "city": "Schüpbach",
    "lat": 46.9261,
    "long": 7.74
  },
  {
    "zipCode": 3536,
    "city": "Aeschau",
    "lat": 46.9095,
    "long": 7.7618
  },
  {
    "zipCode": 3537,
    "city": "Eggiwil",
    "lat": 46.8757,
    "long": 7.7957
  },
  {
    "zipCode": 3538,
    "city": "Röthenbach im Emmental",
    "lat": 46.8542,
    "long": 7.7425
  },
  {
    "zipCode": 3543,
    "city": "Emmenmatt",
    "lat": 46.9487,
    "long": 7.7493
  },
  {
    "zipCode": 3550,
    "city": "Langnau im Emmental",
    "lat": 46.9394,
    "long": 7.7874
  },
  {
    "zipCode": 3551,
    "city": "Oberfrittenbach",
    "lat": 46.9297,
    "long": 7.7963
  },
  {
    "zipCode": 3552,
    "city": "Bärau",
    "lat": 46.9301,
    "long": 7.8114
  },
  {
    "zipCode": 3553,
    "city": "Gohl",
    "lat": 46.9554,
    "long": 7.8062
  },
  {
    "zipCode": 3555,
    "city": "Trubschachen",
    "lat": 46.9223,
    "long": 7.8452
  },
  {
    "zipCode": 3556,
    "city": "Trub",
    "lat": 46.9417,
    "long": 7.88
  },
  {
    "zipCode": 3557,
    "city": "Fankhaus (Trub)",
    "lat": 46.9706,
    "long": 7.9174
  },
  {
    "zipCode": 3600,
    "city": "Thoune",
    "lat": 46.7512,
    "long": 7.6217
  },
  {
    "zipCode": 3602,
    "city": "Thun",
    "lat": 46.7466,
    "long": 7.6222
  },
  {
    "zipCode": 3603,
    "city": "Thun",
    "lat": 46.7512,
    "long": 7.6217
  },
  {
    "zipCode": 3604,
    "city": "Thun",
    "lat": 46.7512,
    "long": 7.6217
  },
  {
    "zipCode": 3607,
    "city": "Thun",
    "lat": 46.7466,
    "long": 7.6222
  },
  {
    "zipCode": 3608,
    "city": "Thun",
    "lat": 46.7512,
    "long": 7.6217
  },
  {
    "zipCode": 3609,
    "city": "Thun",
    "lat": 46.7466,
    "long": 7.6222
  },
  {
    "zipCode": 3612,
    "city": "Steffisburg",
    "lat": 46.7781,
    "long": 7.6325
  },
  {
    "zipCode": 3613,
    "city": "Steffisburg",
    "lat": 46.7781,
    "long": 7.6325
  },
  {
    "zipCode": 3614,
    "city": "Unterlangenegg",
    "lat": 46.7993,
    "long": 7.7012
  },
  {
    "zipCode": 3615,
    "city": "Heimenschwand",
    "lat": 46.8287,
    "long": 7.6947
  },
  {
    "zipCode": 3616,
    "city": "Schwarzenegg",
    "lat": 46.7953,
    "long": 7.7168
  },
  {
    "zipCode": 3617,
    "city": "Fahrni b. Thun",
    "lat": 46.794,
    "long": 7.655
  },
  {
    "zipCode": 3618,
    "city": "Süderen",
    "lat": 46.9885,
    "long": 7.7386
  },
  {
    "zipCode": 3619,
    "city": "Eriz",
    "lat": 46.7877,
    "long": 7.771
  },
  {
    "zipCode": 3619,
    "city": "Innereriz",
    "lat": 46.7883,
    "long": 7.8239
  },
  {
    "zipCode": 3622,
    "city": "Homberg b. Thun",
    "lat": 46.7733,
    "long": 7.6768
  },
  {
    "zipCode": 3623,
    "city": "Teuffenthal b. Thun",
    "lat": 46.7658,
    "long": 7.7127
  },
  {
    "zipCode": 3623,
    "city": "Horrenbach",
    "lat": 46.7748,
    "long": 7.7824
  },
  {
    "zipCode": 3623,
    "city": "Buchen BE",
    "lat": 46.7748,
    "long": 7.7824
  },
  {
    "zipCode": 3624,
    "city": "Schwendibach",
    "lat": 46.7699,
    "long": 7.6619
  },
  {
    "zipCode": 3624,
    "city": "Goldiwil (Thun)",
    "lat": 46.764,
    "long": 7.6706
  },
  {
    "zipCode": 3625,
    "city": "Heiligenschwendi",
    "lat": 46.7511,
    "long": 7.6839
  },
  {
    "zipCode": 3626,
    "city": "Hünibach",
    "lat": 46.7462,
    "long": 7.6503
  },
  {
    "zipCode": 3627,
    "city": "Heimberg",
    "lat": 46.7948,
    "long": 7.6043
  },
  {
    "zipCode": 3628,
    "city": "Uttigen",
    "lat": 46.7944,
    "long": 7.5779
  },
  {
    "zipCode": 3629,
    "city": "Oppligen",
    "lat": 46.8184,
    "long": 7.6007
  },
  {
    "zipCode": 3629,
    "city": "Kiesen",
    "lat": 46.8196,
    "long": 7.584
  },
  {
    "zipCode": 3629,
    "city": "Jaberg",
    "lat": 46.818,
    "long": 7.5692
  },
  {
    "zipCode": 3631,
    "city": "Höfen b. Thun",
    "lat": 46.7101,
    "long": 7.5636
  },
  {
    "zipCode": 3632,
    "city": "Oberstocken",
    "lat": 46.7175,
    "long": 7.5547
  },
  {
    "zipCode": 3632,
    "city": "Niederstocken",
    "lat": 46.7106,
    "long": 7.5721
  },
  {
    "zipCode": 3633,
    "city": "Amsoldingen",
    "lat": 46.7275,
    "long": 7.5825
  },
  {
    "zipCode": 3634,
    "city": "Thierachern",
    "lat": 46.7532,
    "long": 7.5744
  },
  {
    "zipCode": 3635,
    "city": "Uebeschi",
    "lat": 46.7395,
    "long": 7.5473
  },
  {
    "zipCode": 3636,
    "city": "Längenbühl",
    "lat": 46.7647,
    "long": 7.5233
  },
  {
    "zipCode": 3636,
    "city": "Forst b. Längenbühl",
    "lat": 46.7647,
    "long": 7.5233
  },
  {
    "zipCode": 3638,
    "city": "Blumenstein",
    "lat": 46.7421,
    "long": 7.5214
  },
  {
    "zipCode": 3638,
    "city": "Pohlern",
    "lat": 46.7252,
    "long": 7.5353
  },
  {
    "zipCode": 3645,
    "city": "Zwieselberg",
    "lat": 46.7101,
    "long": 7.6167
  },
  {
    "zipCode": 3645,
    "city": "Gwatt (Thun)",
    "lat": 46.7204,
    "long": 7.6223
  },
  {
    "zipCode": 3646,
    "city": "Einigen",
    "lat": 46.708,
    "long": 7.6483
  },
  {
    "zipCode": 3647,
    "city": "Reutigen",
    "lat": 46.6936,
    "long": 7.621
  },
  {
    "zipCode": 3652,
    "city": "Hilterfingen",
    "lat": 46.7352,
    "long": 7.6618
  },
  {
    "zipCode": 3653,
    "city": "Oberhofen am Thunersee",
    "lat": 46.7315,
    "long": 7.669
  },
  {
    "zipCode": 3654,
    "city": "Gunten",
    "lat": 46.7119,
    "long": 7.7024
  },
  {
    "zipCode": 3655,
    "city": "Sigriswil",
    "lat": 46.7166,
    "long": 7.7133
  },
  {
    "zipCode": 3656,
    "city": "Ringoldswil",
    "lat": 46.7347,
    "long": 7.6955
  },
  {
    "zipCode": 3656,
    "city": "Tschingel ob Gunten",
    "lat": 46.7273,
    "long": 7.6981
  },
  {
    "zipCode": 3656,
    "city": "Aeschlen ob Gunten",
    "lat": 46.72,
    "long": 7.7006
  },
  {
    "zipCode": 3657,
    "city": "Schwanden (Sigriswil)",
    "lat": 46.7364,
    "long": 7.7178
  },
  {
    "zipCode": 3658,
    "city": "Merligen",
    "lat": 46.6975,
    "long": 7.7387
  },
  {
    "zipCode": 3661,
    "city": "Uetendorf",
    "lat": 46.7739,
    "long": 7.5725
  },
  {
    "zipCode": 3662,
    "city": "Seftigen",
    "lat": 46.7876,
    "long": 7.5394
  },
  {
    "zipCode": 3663,
    "city": "Gurzelen",
    "lat": 46.7764,
    "long": 7.5426
  },
  {
    "zipCode": 3664,
    "city": "Burgistein",
    "lat": 46.7846,
    "long": 7.4999
  },
  {
    "zipCode": 3665,
    "city": "Wattenwil",
    "lat": 46.7697,
    "long": 7.5083
  },
  {
    "zipCode": 3671,
    "city": "Brenzikofen",
    "lat": 46.8181,
    "long": 7.6171
  },
  {
    "zipCode": 3671,
    "city": "Herbligen",
    "lat": 46.8299,
    "long": 7.6063
  },
  {
    "zipCode": 3672,
    "city": "Aeschlen b. Oberdiessbach",
    "lat": 46.8395,
    "long": 7.6196
  },
  {
    "zipCode": 3672,
    "city": "Oberdiessbach",
    "lat": 46.8395,
    "long": 7.6196
  },
  {
    "zipCode": 3673,
    "city": "Linden",
    "lat": 46.8487,
    "long": 7.6749
  },
  {
    "zipCode": 3674,
    "city": "Bleiken b. Oberdiessbach",
    "lat": 46.8341,
    "long": 7.6295
  },
  {
    "zipCode": 3700,
    "city": "Spiez",
    "lat": 46.6847,
    "long": 7.6911
  },
  {
    "zipCode": 3702,
    "city": "Hondrich",
    "lat": 46.672,
    "long": 7.6811
  },
  {
    "zipCode": 3703,
    "city": "Aeschiried",
    "lat": 46.6462,
    "long": 7.7258
  },
  {
    "zipCode": 3703,
    "city": "Aeschi b. Spiez",
    "lat": 46.6462,
    "long": 7.7258
  },
  {
    "zipCode": 3704,
    "city": "Krattigen",
    "lat": 46.6614,
    "long": 7.7278
  },
  {
    "zipCode": 3705,
    "city": "Faulensee",
    "lat": 46.6742,
    "long": 7.7023
  },
  {
    "zipCode": 3706,
    "city": "Leissigen",
    "lat": 46.6546,
    "long": 7.7755
  },
  {
    "zipCode": 3707,
    "city": "Därligen",
    "lat": 46.6618,
    "long": 7.8081
  },
  {
    "zipCode": 3711,
    "city": "Emdthal",
    "lat": 46.6543,
    "long": 7.685
  },
  {
    "zipCode": 3711,
    "city": "Mülenen",
    "lat": 46.6394,
    "long": 7.6941
  },
  {
    "zipCode": 3713,
    "city": "Reichenbach im Kandertal",
    "lat": 46.6254,
    "long": 7.6936
  },
  {
    "zipCode": 3714,
    "city": "Frutigen",
    "lat": 46.5872,
    "long": 7.6494
  },
  {
    "zipCode": 3714,
    "city": "Wengi b. Frutigen",
    "lat": 46.5753,
    "long": 7.7369
  },
  {
    "zipCode": 3715,
    "city": "Adelboden",
    "lat": 46.4914,
    "long": 7.5603
  },
  {
    "zipCode": 3716,
    "city": "Kandergrund",
    "lat": 46.5621,
    "long": 7.659
  },
  {
    "zipCode": 3717,
    "city": "Blausee-Mitholz",
    "lat": 46.5332,
    "long": 7.6641
  },
  {
    "zipCode": 3718,
    "city": "Kandersteg",
    "lat": 46.4947,
    "long": 7.6733
  },
  {
    "zipCode": 3722,
    "city": "Scharnachtal",
    "lat": 46.6162,
    "long": 7.698
  },
  {
    "zipCode": 3723,
    "city": "Kiental",
    "lat": 46.5877,
    "long": 7.7245
  },
  {
    "zipCode": 3724,
    "city": "Ried (Frutigen)",
    "lat": 46.5668,
    "long": 7.6172
  },
  {
    "zipCode": 3725,
    "city": "Achseten",
    "lat": 46.5277,
    "long": 7.5967
  },
  {
    "zipCode": 3752,
    "city": "Wimmis",
    "lat": 46.6759,
    "long": 7.6397
  },
  {
    "zipCode": 3753,
    "city": "Oey",
    "lat": 46.6592,
    "long": 7.5768
  },
  {
    "zipCode": 3754,
    "city": "Diemtigen",
    "lat": 46.6493,
    "long": 7.5648
  },
  {
    "zipCode": 3755,
    "city": "Horboden",
    "lat": 46.6316,
    "long": 7.5621
  },
  {
    "zipCode": 3756,
    "city": "Zwischenflüh",
    "lat": 46.6072,
    "long": 7.5155
  },
  {
    "zipCode": 3757,
    "city": "Schwenden im Diemtigtal",
    "lat": 46.5801,
    "long": 7.4906
  },
  {
    "zipCode": 3758,
    "city": "Latterbach",
    "lat": 46.6656,
    "long": 7.5768
  },
  {
    "zipCode": 3762,
    "city": "Erlenbach im Simmental",
    "lat": 46.6602,
    "long": 7.5545
  },
  {
    "zipCode": 3763,
    "city": "Därstetten",
    "lat": 46.6595,
    "long": 7.4911
  },
  {
    "zipCode": 3764,
    "city": "Weissenburg",
    "lat": 46.6582,
    "long": 7.476
  },
  {
    "zipCode": 3765,
    "city": "Oberwil im Simmental",
    "lat": 46.6569,
    "long": 7.4351
  },
  {
    "zipCode": 3766,
    "city": "Boltigen",
    "lat": 46.6289,
    "long": 7.3911
  },
  {
    "zipCode": 3770,
    "city": "Zweisimmen",
    "lat": 46.5554,
    "long": 7.373
  },
  {
    "zipCode": 3771,
    "city": "Blankenburg",
    "lat": 46.5333,
    "long": 7.3833
  },
  {
    "zipCode": 3772,
    "city": "St. Stephan",
    "lat": 46.5083,
    "long": 7.3956
  },
  {
    "zipCode": 3773,
    "city": "Matten (St. Stephan)",
    "lat": 46.4959,
    "long": 7.4245
  },
  {
    "zipCode": 3775,
    "city": "Lenk im Simmental",
    "lat": 46.4583,
    "long": 7.443
  },
  {
    "zipCode": 3776,
    "city": "Oeschseite",
    "lat": 46.5306,
    "long": 7.3511
  },
  {
    "zipCode": 3777,
    "city": "Saanenmöser",
    "lat": 46.5164,
    "long": 7.3094
  },
  {
    "zipCode": 3778,
    "city": "Schönried",
    "lat": 46.5039,
    "long": 7.2888
  },
  {
    "zipCode": 3780,
    "city": "Gstaad",
    "lat": 46.4722,
    "long": 7.2869
  },
  {
    "zipCode": 3781,
    "city": "Turbach",
    "lat": 46.4786,
    "long": 7.3312
  },
  {
    "zipCode": 3782,
    "city": "Lauenen b. Gstaad",
    "lat": 46.4244,
    "long": 7.3217
  },
  {
    "zipCode": 3783,
    "city": "Grund b. Gstaad",
    "lat": 46.4516,
    "long": 7.2778
  },
  {
    "zipCode": 3784,
    "city": "Feutersoey",
    "lat": 46.4156,
    "long": 7.271
  },
  {
    "zipCode": 3785,
    "city": "Gsteig b. Gstaad",
    "lat": 46.3859,
    "long": 7.2675
  },
  {
    "zipCode": 3792,
    "city": "Saanen",
    "lat": 46.4894,
    "long": 7.26
  },
  {
    "zipCode": 3800,
    "city": "Matten b. Interlaken",
    "lat": 46.6783,
    "long": 7.8689
  },
  {
    "zipCode": 3800,
    "city": "Sundlauenen",
    "lat": 46.6863,
    "long": 7.7931
  },
  {
    "zipCode": 3800,
    "city": "Interlaken",
    "lat": 46.6839,
    "long": 7.8664
  },
  {
    "zipCode": 3801,
    "city": "Jungfraujoch",
    "lat": 46.5468,
    "long": 7.9822
  },
  {
    "zipCode": 3802,
    "city": "Interlaken Ost",
    "lat": 46.6871,
    "long": 7.8649
  },
  {
    "zipCode": 3803,
    "city": "Beatenberg",
    "lat": 46.699,
    "long": 7.7943
  },
  {
    "zipCode": 3804,
    "city": "Habkern",
    "lat": 46.7264,
    "long": 7.863
  },
  {
    "zipCode": 3805,
    "city": "Goldswil b. Interlaken",
    "lat": 46.6967,
    "long": 7.8781
  },
  {
    "zipCode": 3806,
    "city": "Bönigen b. Interlaken",
    "lat": 46.6874,
    "long": 7.8935
  },
  {
    "zipCode": 3807,
    "city": "Iseltwald",
    "lat": 46.7108,
    "long": 7.9642
  },
  {
    "zipCode": 3812,
    "city": "Wilderswil",
    "lat": 46.6637,
    "long": 7.8617
  },
  {
    "zipCode": 3813,
    "city": "Saxeten",
    "lat": 46.6366,
    "long": 7.8309
  },
  {
    "zipCode": 3814,
    "city": "Gsteigwiler",
    "lat": 46.6554,
    "long": 7.8719
  },
  {
    "zipCode": 3815,
    "city": "Zweilütschinen",
    "lat": 46.6314,
    "long": 7.9015
  },
  {
    "zipCode": 3815,
    "city": "Gündlischwand",
    "lat": 46.6322,
    "long": 7.9127
  },
  {
    "zipCode": 3816,
    "city": "Burglauenen",
    "lat": 46.6372,
    "long": 7.9764
  },
  {
    "zipCode": 3816,
    "city": "Lütschental",
    "lat": 46.6378,
    "long": 7.947
  },
  {
    "zipCode": 3818,
    "city": "Grindelwald",
    "lat": 46.624,
    "long": 8.036
  },
  {
    "zipCode": 3822,
    "city": "Lauterbrunnen",
    "lat": 46.5931,
    "long": 7.9094
  },
  {
    "zipCode": 3822,
    "city": "Isenfluh",
    "lat": 46.6198,
    "long": 7.8948
  },
  {
    "zipCode": 3823,
    "city": "Kleine Scheidegg",
    "lat": 46.5861,
    "long": 7.9613
  },
  {
    "zipCode": 3823,
    "city": "Eigergletscher",
    "lat": 46.5749,
    "long": 7.9738
  },
  {
    "zipCode": 3823,
    "city": "Wengen",
    "lat": 46.606,
    "long": 7.9201
  },
  {
    "zipCode": 3824,
    "city": "Stechelberg",
    "lat": 46.5431,
    "long": 7.9015
  },
  {
    "zipCode": 3825,
    "city": "Mürren",
    "lat": 46.5588,
    "long": 7.8929
  },
  {
    "zipCode": 3826,
    "city": "Gimmelwald",
    "lat": 46.5455,
    "long": 7.8914
  },
  {
    "zipCode": 3852,
    "city": "Ringgenberg BE",
    "lat": 46.7011,
    "long": 7.8944
  },
  {
    "zipCode": 3853,
    "city": "Niederried b. Interlaken",
    "lat": 46.7187,
    "long": 7.9324
  },
  {
    "zipCode": 3854,
    "city": "Oberried am Brienzersee",
    "lat": 46.7363,
    "long": 7.9593
  },
  {
    "zipCode": 3855,
    "city": "Axalp",
    "lat": 46.7252,
    "long": 8.0382
  },
  {
    "zipCode": 3855,
    "city": "Brienz BE",
    "lat": 46.7545,
    "long": 8.0385
  },
  {
    "zipCode": 3855,
    "city": "Schwanden b. Brienz",
    "lat": 46.7711,
    "long": 8.0557
  },
  {
    "zipCode": 3856,
    "city": "Brienzwiler",
    "lat": 46.7508,
    "long": 8.1014
  },
  {
    "zipCode": 3857,
    "city": "Unterbach BE",
    "lat": 46.7374,
    "long": 8.1101
  },
  {
    "zipCode": 3858,
    "city": "Hofstetten b. Brienz",
    "lat": 46.7535,
    "long": 8.0749
  },
  {
    "zipCode": 3860,
    "city": "Meiringen",
    "lat": 46.7271,
    "long": 8.1872
  },
  {
    "zipCode": 3860,
    "city": "Schattenhalb",
    "lat": 46.719,
    "long": 8.1907
  },
  {
    "zipCode": 3860,
    "city": "Rosenlaui",
    "lat": 46.6796,
    "long": 8.1539
  },
  {
    "zipCode": 3860,
    "city": "Brünig",
    "lat": 46.7186,
    "long": 8.1342
  },
  {
    "zipCode": 3862,
    "city": "Innertkirchen",
    "lat": 46.7047,
    "long": 8.2288
  },
  {
    "zipCode": 3863,
    "city": "Gadmen",
    "lat": 46.7373,
    "long": 8.3522
  },
  {
    "zipCode": 3864,
    "city": "Guttannen",
    "lat": 46.6551,
    "long": 8.2895
  },
  {
    "zipCode": 3900,
    "city": "Viège",
    "lat": 46.3167,
    "long": 7.9833
  },
  {
    "zipCode": 3901,
    "city": "Rothwald",
    "lat": 46.2818,
    "long": 8.0402
  },
  {
    "zipCode": 3902,
    "city": "Glis",
    "lat": 46.3093,
    "long": 7.972
  },
  {
    "zipCode": 3903,
    "city": "Mund",
    "lat": 46.315,
    "long": 7.9412
  },
  {
    "zipCode": 3903,
    "city": "Birgisch",
    "lat": 46.3187,
    "long": 7.9577
  },
  {
    "zipCode": 3904,
    "city": "Naters",
    "lat": 46.3254,
    "long": 7.9891
  },
  {
    "zipCode": 3905,
    "city": "Saas-Almagell",
    "lat": 46.0935,
    "long": 7.9574
  },
  {
    "zipCode": 3906,
    "city": "Saas-Fee",
    "lat": 46.1081,
    "long": 7.9274
  },
  {
    "zipCode": 3907,
    "city": "Gabi (Simplon)",
    "lat": 46.1837,
    "long": 8.0731
  },
  {
    "zipCode": 3907,
    "city": "Simplon Dorf",
    "lat": 46.1945,
    "long": 8.0575
  },
  {
    "zipCode": 3907,
    "city": "Gondo",
    "lat": 46.1964,
    "long": 8.1388
  },
  {
    "zipCode": 3908,
    "city": "Saas-Balen",
    "lat": 46.1544,
    "long": 7.927
  },
  {
    "zipCode": 3910,
    "city": "Saas-Grund",
    "lat": 46.1228,
    "long": 7.9365
  },
  {
    "zipCode": 3911,
    "city": "Ried-Brig",
    "lat": 46.3138,
    "long": 8.0175
  },
  {
    "zipCode": 3912,
    "city": "Termen",
    "lat": 46.3269,
    "long": 8.021
  },
  {
    "zipCode": 3913,
    "city": "Rosswald",
    "lat": 46.3056,
    "long": 8.0417
  },
  {
    "zipCode": 3914,
    "city": "Belalp",
    "lat": 46.3708,
    "long": 7.9712
  },
  {
    "zipCode": 3914,
    "city": "Blatten b. Naters",
    "lat": 46.3708,
    "long": 7.9712
  },
  {
    "zipCode": 3916,
    "city": "Ferden",
    "lat": 46.3936,
    "long": 7.7592
  },
  {
    "zipCode": 3917,
    "city": "Kippel",
    "lat": 46.3988,
    "long": 7.7719
  },
  {
    "zipCode": 3917,
    "city": "Goppenstein",
    "lat": 46.369,
    "long": 7.7541
  },
  {
    "zipCode": 3918,
    "city": "Wiler (Lötschen)",
    "lat": 46.4032,
    "long": 7.7816
  },
  {
    "zipCode": 3919,
    "city": "Blatten (Lötschen)",
    "lat": 46.4207,
    "long": 7.8175
  },
  {
    "zipCode": 3920,
    "city": "Zermatt",
    "lat": 46.02,
    "long": 7.7486
  },
  {
    "zipCode": 3922,
    "city": "Stalden VS",
    "lat": 46.2334,
    "long": 7.8727
  },
  {
    "zipCode": 3922,
    "city": "Kalpetran",
    "lat": 46.2148,
    "long": 7.8386
  },
  {
    "zipCode": 3922,
    "city": "Eisten",
    "lat": 46.2007,
    "long": 7.8928
  },
  {
    "zipCode": 3923,
    "city": "Törbel",
    "lat": 46.2384,
    "long": 7.8524
  },
  {
    "zipCode": 3924,
    "city": "St. Niklaus VS",
    "lat": 46.1772,
    "long": 7.8035
  },
  {
    "zipCode": 3925,
    "city": "Grächen",
    "lat": 46.1953,
    "long": 7.8375
  },
  {
    "zipCode": 3926,
    "city": "Embd",
    "lat": 46.215,
    "long": 7.8267
  },
  {
    "zipCode": 3927,
    "city": "Herbriggen",
    "lat": 46.1359,
    "long": 7.7923
  },
  {
    "zipCode": 3928,
    "city": "Randa",
    "lat": 46.0988,
    "long": 7.7823
  },
  {
    "zipCode": 3929,
    "city": "Täsch",
    "lat": 46.0684,
    "long": 7.7777
  },
  {
    "zipCode": 3930,
    "city": "Visp",
    "lat": 46.2937,
    "long": 7.8815
  },
  {
    "zipCode": 3930,
    "city": "Eyholz",
    "lat": 46.2942,
    "long": 7.9084
  },
  {
    "zipCode": 3931,
    "city": "Lalden",
    "lat": 46.2995,
    "long": 7.9023
  },
  {
    "zipCode": 3932,
    "city": "Visperterminen",
    "lat": 46.259,
    "long": 7.9019
  },
  {
    "zipCode": 3933,
    "city": "Staldenried",
    "lat": 46.2294,
    "long": 7.8827
  },
  {
    "zipCode": 3934,
    "city": "Zeneggen",
    "lat": 46.2734,
    "long": 7.8654
  },
  {
    "zipCode": 3935,
    "city": "Bürchen",
    "lat": 46.2805,
    "long": 7.8151
  },
  {
    "zipCode": 3937,
    "city": "Baltschieder",
    "lat": 46.3089,
    "long": 7.8657
  },
  {
    "zipCode": 3937,
    "city": "Baltschieder",
    "lat": 46.3089,
    "long": 7.8657
  },
  {
    "zipCode": 3938,
    "city": "Ausserberg",
    "lat": 46.3139,
    "long": 7.853
  },
  {
    "zipCode": 3939,
    "city": "Eggerberg",
    "lat": 46.3068,
    "long": 7.8763
  },
  {
    "zipCode": 3940,
    "city": "Steg VS",
    "lat": 46.3149,
    "long": 7.7492
  },
  {
    "zipCode": 3942,
    "city": "Niedergesteln",
    "lat": 46.3124,
    "long": 7.7836
  },
  {
    "zipCode": 3942,
    "city": "Raron",
    "lat": 46.312,
    "long": 7.8003
  },
  {
    "zipCode": 3942,
    "city": "St. German",
    "lat": 46.3128,
    "long": 7.8228
  },
  {
    "zipCode": 3943,
    "city": "Eischoll",
    "lat": 46.2935,
    "long": 7.78
  },
  {
    "zipCode": 3944,
    "city": "Unterbäch VS",
    "lat": 46.2843,
    "long": 7.7992
  },
  {
    "zipCode": 3945,
    "city": "Niedergampel",
    "lat": 46.3127,
    "long": 7.7129
  },
  {
    "zipCode": 3945,
    "city": "Gampel",
    "lat": 46.316,
    "long": 7.7421
  },
  {
    "zipCode": 3946,
    "city": "Gruben",
    "lat": 46.2114,
    "long": 7.7062
  },
  {
    "zipCode": 3946,
    "city": "Turtmann",
    "lat": 46.3003,
    "long": 7.702
  },
  {
    "zipCode": 3947,
    "city": "Ergisch",
    "lat": 46.2922,
    "long": 7.7147
  },
  {
    "zipCode": 3948,
    "city": "Unterems",
    "lat": 46.2916,
    "long": 7.6959
  },
  {
    "zipCode": 3948,
    "city": "Oberems",
    "lat": 46.2819,
    "long": 7.6935
  },
  {
    "zipCode": 3949,
    "city": "Hohtenn",
    "lat": 46.3189,
    "long": 7.7557
  },
  {
    "zipCode": 3951,
    "city": "Agarn",
    "lat": 46.2975,
    "long": 7.6632
  },
  {
    "zipCode": 3952,
    "city": "Susten",
    "lat": 46.3111,
    "long": 7.6433
  },
  {
    "zipCode": 3953,
    "city": "Varen",
    "lat": 46.3186,
    "long": 7.6074
  },
  {
    "zipCode": 3953,
    "city": "Inden",
    "lat": 46.3444,
    "long": 7.6174
  },
  {
    "zipCode": 3953,
    "city": "Leuk Stadt",
    "lat": 46.3174,
    "long": 7.6341
  },
  {
    "zipCode": 3954,
    "city": "Leukerbad",
    "lat": 46.3794,
    "long": 7.6269
  },
  {
    "zipCode": 3955,
    "city": "Albinen",
    "lat": 46.3407,
    "long": 7.6332
  },
  {
    "zipCode": 3956,
    "city": "Guttet-Feschel",
    "lat": 46.3253,
    "long": 7.667
  },
  {
    "zipCode": 3957,
    "city": "Erschmatt",
    "lat": 46.3218,
    "long": 7.6915
  },
  {
    "zipCode": 3957,
    "city": "Bratsch",
    "lat": 46.3207,
    "long": 7.7083
  },
  {
    "zipCode": 3960,
    "city": "Sierre",
    "lat": 46.2919,
    "long": 7.5356
  },
  {
    "zipCode": 3961,
    "city": "Zinal",
    "lat": 46.1343,
    "long": 7.6287
  },
  {
    "zipCode": 3961,
    "city": "St-Jean VS",
    "lat": 46.1969,
    "long": 7.5866
  },
  {
    "zipCode": 3961,
    "city": "Mission",
    "lat": 46.1911,
    "long": 7.5936
  },
  {
    "zipCode": 3961,
    "city": "Chandolin",
    "lat": 46.2519,
    "long": 7.5937
  },
  {
    "zipCode": 3961,
    "city": "Vissoie",
    "lat": 46.2162,
    "long": 7.5864
  },
  {
    "zipCode": 3961,
    "city": "Grimentz",
    "lat": 46.1809,
    "long": 7.5758
  },
  {
    "zipCode": 3961,
    "city": "St-Luc",
    "lat": 46.2215,
    "long": 7.5962
  },
  {
    "zipCode": 3961,
    "city": "Ayer",
    "lat": 46.1809,
    "long": 7.6012
  },
  {
    "zipCode": 3963,
    "city": "Montana",
    "lat": 46.3134,
    "long": 7.4884
  },
  {
    "zipCode": 3963,
    "city": "Crans-Montana",
    "lat": 46.3132,
    "long": 7.4791
  },
  {
    "zipCode": 3963,
    "city": "Aminona",
    "lat": 46.3313,
    "long": 7.5328
  },
  {
    "zipCode": 3965,
    "city": "Chippis",
    "lat": 46.2802,
    "long": 7.5396
  },
  {
    "zipCode": 3966,
    "city": "Chalais",
    "lat": 46.2676,
    "long": 7.5114
  },
  {
    "zipCode": 3966,
    "city": "Réchy",
    "lat": 46.2626,
    "long": 7.4962
  },
  {
    "zipCode": 3967,
    "city": "Vercorin",
    "lat": 46.2565,
    "long": 7.531
  },
  {
    "zipCode": 3968,
    "city": "Veyras",
    "lat": 46.3021,
    "long": 7.5362
  },
  {
    "zipCode": 3970,
    "city": "Salgesch",
    "lat": 46.3116,
    "long": 7.5712
  },
  {
    "zipCode": 3971,
    "city": "Chermignon-d'en-Bas",
    "lat": 46.2882,
    "long": 7.4744
  },
  {
    "zipCode": 3971,
    "city": "Ollon VS",
    "lat": 46.275,
    "long": 7.479
  },
  {
    "zipCode": 3971,
    "city": "Chermignon",
    "lat": 46.2884,
    "long": 7.4749
  },
  {
    "zipCode": 3972,
    "city": "Miège",
    "lat": 46.3112,
    "long": 7.547
  },
  {
    "zipCode": 3973,
    "city": "Venthône",
    "lat": 46.3067,
    "long": 7.5292
  },
  {
    "zipCode": 3974,
    "city": "Mollens VS",
    "lat": 46.3165,
    "long": 7.5212
  },
  {
    "zipCode": 3975,
    "city": "Randogne",
    "lat": 46.3095,
    "long": 7.5006
  },
  {
    "zipCode": 3976,
    "city": "Champzabé",
    "lat": 46.2792,
    "long": 7.4994
  },
  {
    "zipCode": 3976,
    "city": "Noës",
    "lat": 46.2798,
    "long": 7.5025
  },
  {
    "zipCode": 3977,
    "city": "Granges VS",
    "lat": 46.2618,
    "long": 7.4675
  },
  {
    "zipCode": 3978,
    "city": "Flanthey",
    "lat": 46.2691,
    "long": 7.4471
  },
  {
    "zipCode": 3979,
    "city": "Grône",
    "lat": 46.2529,
    "long": 7.4595
  },
  {
    "zipCode": 3982,
    "city": "Bitsch",
    "lat": 46.3378,
    "long": 8.0109
  },
  {
    "zipCode": 3983,
    "city": "Filet",
    "lat": 46.3607,
    "long": 8.0532
  },
  {
    "zipCode": 3983,
    "city": "Bister",
    "lat": 46.3603,
    "long": 8.0645
  },
  {
    "zipCode": 3983,
    "city": "Mörel",
    "lat": 46.3566,
    "long": 8.0446
  },
  {
    "zipCode": 3983,
    "city": "Greich",
    "lat": 46.3679,
    "long": 8.0402
  },
  {
    "zipCode": 3983,
    "city": "Goppisberg",
    "lat": 46.3714,
    "long": 8.0504
  },
  {
    "zipCode": 3984,
    "city": "Fieschertal",
    "lat": 46.422,
    "long": 8.1454
  },
  {
    "zipCode": 3984,
    "city": "Fiesch",
    "lat": 46.4443,
    "long": 8.157
  },
  {
    "zipCode": 3984,
    "city": "Fiesch",
    "lat": 46.3998,
    "long": 8.1353
  },
  {
    "zipCode": 3985,
    "city": "Münster VS",
    "lat": 46.4865,
    "long": 8.2643
  },
  {
    "zipCode": 3985,
    "city": "Geschinen",
    "lat": 46.4865,
    "long": 8.2643
  },
  {
    "zipCode": 3986,
    "city": "Ried-Mörel",
    "lat": 46.3571,
    "long": 8.0314
  },
  {
    "zipCode": 3987,
    "city": "Riederalp",
    "lat": 46.3764,
    "long": 8.0261
  },
  {
    "zipCode": 3988,
    "city": "Ulrichen",
    "lat": 46.5054,
    "long": 8.3096
  },
  {
    "zipCode": 3988,
    "city": "Obergesteln",
    "lat": 46.5143,
    "long": 8.3253
  },
  {
    "zipCode": 3989,
    "city": "Blitzingen",
    "lat": 46.4429,
    "long": 8.2019
  },
  {
    "zipCode": 3989,
    "city": "Niederwald",
    "lat": 46.4354,
    "long": 8.1899
  },
  {
    "zipCode": 3989,
    "city": "Biel VS",
    "lat": 46.4559,
    "long": 8.2177
  },
  {
    "zipCode": 3989,
    "city": "Ritzingen",
    "lat": 46.4566,
    "long": 8.2216
  },
  {
    "zipCode": 3989,
    "city": "Selkingen",
    "lat": 46.4552,
    "long": 8.2154
  },
  {
    "zipCode": 3991,
    "city": "Betten",
    "lat": 46.3771,
    "long": 8.0696
  },
  {
    "zipCode": 3992,
    "city": "Bettmeralp",
    "lat": 46.3902,
    "long": 8.0625
  },
  {
    "zipCode": 3993,
    "city": "Grengiols",
    "lat": 46.374,
    "long": 8.093
  },
  {
    "zipCode": 3994,
    "city": "Lax",
    "lat": 46.3884,
    "long": 8.117
  },
  {
    "zipCode": 3994,
    "city": "Martisberg",
    "lat": 46.3871,
    "long": 8.0985
  },
  {
    "zipCode": 3995,
    "city": "Steinhaus",
    "lat": 46.4218,
    "long": 8.1774
  },
  {
    "zipCode": 3995,
    "city": "Ausserbinn",
    "lat": 46.3828,
    "long": 8.1473
  },
  {
    "zipCode": 3995,
    "city": "Mühlebach (Goms)",
    "lat": 46.4085,
    "long": 8.1562
  },
  {
    "zipCode": 3995,
    "city": "Steinhaus",
    "lat": 46.4218,
    "long": 8.1774
  },
  {
    "zipCode": 3995,
    "city": "Ernen",
    "lat": 46.3968,
    "long": 8.1417
  },
  {
    "zipCode": 3995,
    "city": "Mühlebach (Goms)",
    "lat": 46.4085,
    "long": 8.1562
  },
  {
    "zipCode": 3996,
    "city": "Binn",
    "lat": 46.3639,
    "long": 8.1842
  },
  {
    "zipCode": 3997,
    "city": "Bellwald",
    "lat": 46.4276,
    "long": 8.1614
  },
  {
    "zipCode": 3998,
    "city": "Reckingen VS",
    "lat": 46.4699,
    "long": 8.2416
  },
  {
    "zipCode": 3998,
    "city": "Gluringen",
    "lat": 46.4699,
    "long": 8.2416
  },
  {
    "zipCode": 3999,
    "city": "Oberwald",
    "lat": 46.5319,
    "long": 8.355
  },
  {
    "zipCode": 4000,
    "city": "Bâle",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4001,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4002,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4005,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4009,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4010,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4018,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4019,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4020,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4030,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4031,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4039,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4040,
    "city": "Basel",
    "lat": 47.5186,
    "long": 7.6174
  },
  {
    "zipCode": 4041,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4042,
    "city": "Basel PF OC",
    "lat": 47.5186,
    "long": 7.6174
  },
  {
    "zipCode": 4051,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4052,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4052,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4053,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4054,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4055,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4056,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4057,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4058,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4059,
    "city": "Basel",
    "lat": 47.5584,
    "long": 7.5733
  },
  {
    "zipCode": 4070,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4075,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4089,
    "city": "Basel SPI GLS",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4089,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4091,
    "city": "Basel",
    "lat": 47.5577,
    "long": 7.5936
  },
  {
    "zipCode": 4101,
    "city": "Bruderholz",
    "lat": 47.5366,
    "long": 7.5679
  },
  {
    "zipCode": 4102,
    "city": "Binningen",
    "lat": 47.5402,
    "long": 7.5693
  },
  {
    "zipCode": 4103,
    "city": "Bottmingen",
    "lat": 47.5234,
    "long": 7.5721
  },
  {
    "zipCode": 4104,
    "city": "Oberwil BL",
    "lat": 47.5141,
    "long": 7.5579
  },
  {
    "zipCode": 4105,
    "city": "Biel-Benken BL",
    "lat": 47.5078,
    "long": 7.5258
  },
  {
    "zipCode": 4106,
    "city": "Therwil",
    "lat": 47.5012,
    "long": 7.5529
  },
  {
    "zipCode": 4107,
    "city": "Ettingen",
    "lat": 47.4827,
    "long": 7.5498
  },
  {
    "zipCode": 4108,
    "city": "Witterswil",
    "lat": 47.4866,
    "long": 7.5212
  },
  {
    "zipCode": 4112,
    "city": "Bättwil",
    "lat": 47.4895,
    "long": 7.5083
  },
  {
    "zipCode": 4112,
    "city": "Flüh",
    "lat": 47.4722,
    "long": 7.5083
  },
  {
    "zipCode": 4114,
    "city": "Hofstetten SO",
    "lat": 47.4767,
    "long": 7.5159
  },
  {
    "zipCode": 4115,
    "city": "Mariastein",
    "lat": 47.4757,
    "long": 7.4892
  },
  {
    "zipCode": 4116,
    "city": "Metzerlen",
    "lat": 47.4663,
    "long": 7.4657
  },
  {
    "zipCode": 4117,
    "city": "Burg im Leimental",
    "lat": 47.4596,
    "long": 7.4381
  },
  {
    "zipCode": 4118,
    "city": "Rodersdorf",
    "lat": 47.4822,
    "long": 7.4576
  },
  {
    "zipCode": 4123,
    "city": "Allschwil",
    "lat": 47.5507,
    "long": 7.536
  },
  {
    "zipCode": 4124,
    "city": "Schönenbuch",
    "lat": 47.5385,
    "long": 7.5057
  },
  {
    "zipCode": 4125,
    "city": "Riehen",
    "lat": 47.5788,
    "long": 7.6468
  },
  {
    "zipCode": 4126,
    "city": "Bettingen",
    "lat": 47.5704,
    "long": 7.6643
  },
  {
    "zipCode": 4127,
    "city": "Birsfelden",
    "lat": 47.5529,
    "long": 7.6232
  },
  {
    "zipCode": 4132,
    "city": "Muttenz",
    "lat": 47.5227,
    "long": 7.6451
  },
  {
    "zipCode": 4133,
    "city": "Pratteln",
    "lat": 47.5207,
    "long": 7.6936
  },
  {
    "zipCode": 4142,
    "city": "Münchenstein",
    "lat": 47.5185,
    "long": 7.6097
  },
  {
    "zipCode": 4143,
    "city": "Dornach",
    "lat": 47.4804,
    "long": 7.6164
  },
  {
    "zipCode": 4144,
    "city": "Arlesheim",
    "lat": 47.4941,
    "long": 7.6198
  },
  {
    "zipCode": 4145,
    "city": "Gempen",
    "lat": 47.4759,
    "long": 7.6603
  },
  {
    "zipCode": 4146,
    "city": "Hochwald",
    "lat": 47.4583,
    "long": 7.6418
  },
  {
    "zipCode": 4147,
    "city": "Aesch BL",
    "lat": 47.471,
    "long": 7.5973
  },
  {
    "zipCode": 4148,
    "city": "Pfeffingen",
    "lat": 47.4598,
    "long": 7.5898
  },
  {
    "zipCode": 4153,
    "city": "Reinach BL",
    "lat": 47.497,
    "long": 7.5917
  },
  {
    "zipCode": 4202,
    "city": "Duggingen",
    "lat": 47.4518,
    "long": 7.6051
  },
  {
    "zipCode": 4203,
    "city": "Grellingen",
    "lat": 47.4423,
    "long": 7.5891
  },
  {
    "zipCode": 4204,
    "city": "Himmelried",
    "lat": 47.4211,
    "long": 7.5966
  },
  {
    "zipCode": 4206,
    "city": "Seewen SO",
    "lat": 47.4374,
    "long": 7.6615
  },
  {
    "zipCode": 4207,
    "city": "Bretzwil",
    "lat": 47.3978,
    "long": 7.6522
  },
  {
    "zipCode": 4208,
    "city": "Nunningen",
    "lat": 47.3945,
    "long": 7.6212
  },
  {
    "zipCode": 4222,
    "city": "Zwingen",
    "lat": 47.4382,
    "long": 7.5303
  },
  {
    "zipCode": 4223,
    "city": "Blauen",
    "lat": 47.4502,
    "long": 7.5185
  },
  {
    "zipCode": 4224,
    "city": "Nenzlingen",
    "lat": 47.4474,
    "long": 7.557
  },
  {
    "zipCode": 4225,
    "city": "Brislach",
    "lat": 47.4176,
    "long": 7.5434
  },
  {
    "zipCode": 4226,
    "city": "Breitenbach",
    "lat": 47.4056,
    "long": 7.5438
  },
  {
    "zipCode": 4227,
    "city": "Büsserach",
    "lat": 47.3946,
    "long": 7.5412
  },
  {
    "zipCode": 4228,
    "city": "Erschwil",
    "lat": 47.3739,
    "long": 7.5414
  },
  {
    "zipCode": 4229,
    "city": "Beinwil SO",
    "lat": 47.3626,
    "long": 7.5871
  },
  {
    "zipCode": 4232,
    "city": "Fehren",
    "lat": 47.3965,
    "long": 7.577
  },
  {
    "zipCode": 4233,
    "city": "Meltingen",
    "lat": 47.3841,
    "long": 7.5867
  },
  {
    "zipCode": 4234,
    "city": "Zullwil",
    "lat": 47.3911,
    "long": 7.6005
  },
  {
    "zipCode": 4242,
    "city": "Laufen",
    "lat": 47.4219,
    "long": 7.4995
  },
  {
    "zipCode": 4243,
    "city": "Dittingen",
    "lat": 47.442,
    "long": 7.4962
  },
  {
    "zipCode": 4244,
    "city": "Röschenz",
    "lat": 47.4237,
    "long": 7.4802
  },
  {
    "zipCode": 4245,
    "city": "Kleinlützel",
    "lat": 47.4254,
    "long": 7.4229
  },
  {
    "zipCode": 4246,
    "city": "Wahlen b. Laufen",
    "lat": 47.398,
    "long": 7.5115
  },
  {
    "zipCode": 4247,
    "city": "Grindel",
    "lat": 47.3807,
    "long": 7.5059
  },
  {
    "zipCode": 4252,
    "city": "Bärschwil",
    "lat": 47.3822,
    "long": 7.4723
  },
  {
    "zipCode": 4253,
    "city": "Liesberg",
    "lat": 47.404,
    "long": 7.4279
  },
  {
    "zipCode": 4254,
    "city": "Liesberg Dorf",
    "lat": 47.4033,
    "long": 7.4341
  },
  {
    "zipCode": 4302,
    "city": "Augst BL",
    "lat": 47.5356,
    "long": 7.7147
  },
  {
    "zipCode": 4303,
    "city": "Kaiseraugst",
    "lat": 47.5397,
    "long": 7.726
  },
  {
    "zipCode": 4304,
    "city": "Giebenach",
    "lat": 47.523,
    "long": 7.7397
  },
  {
    "zipCode": 4305,
    "city": "Olsberg",
    "lat": 47.5233,
    "long": 7.7837
  },
  {
    "zipCode": 4310,
    "city": "Rheinfelden",
    "lat": 47.5544,
    "long": 7.794
  },
  {
    "zipCode": 4312,
    "city": "Magden",
    "lat": 47.5287,
    "long": 7.8113
  },
  {
    "zipCode": 4313,
    "city": "Möhlin",
    "lat": 47.5592,
    "long": 7.8433
  },
  {
    "zipCode": 4314,
    "city": "Zeiningen",
    "lat": 47.5414,
    "long": 7.8718
  },
  {
    "zipCode": 4315,
    "city": "Zuzgen",
    "lat": 47.5251,
    "long": 7.8999
  },
  {
    "zipCode": 4316,
    "city": "Hellikon",
    "lat": 47.5094,
    "long": 7.9242
  },
  {
    "zipCode": 4317,
    "city": "Wegenstetten",
    "lat": 47.4979,
    "long": 7.9316
  },
  {
    "zipCode": 4322,
    "city": "Mumpf",
    "lat": 47.5456,
    "long": 7.9212
  },
  {
    "zipCode": 4323,
    "city": "Wallbach",
    "lat": 47.5598,
    "long": 7.9029
  },
  {
    "zipCode": 4324,
    "city": "Obermumpf",
    "lat": 47.5294,
    "long": 7.9376
  },
  {
    "zipCode": 4325,
    "city": "Schupfart",
    "lat": 47.5137,
    "long": 7.9658
  },
  {
    "zipCode": 4332,
    "city": "Stein",
    "lat": 47.544,
    "long": 7.9526
  },
  {
    "zipCode": 4333,
    "city": "Münchwilen AG",
    "lat": 47.5357,
    "long": 7.9641
  },
  {
    "zipCode": 4334,
    "city": "Sisseln AG",
    "lat": 47.5531,
    "long": 7.9917
  },
  {
    "zipCode": 4402,
    "city": "Frenkendorf",
    "lat": 47.5069,
    "long": 7.7165
  },
  {
    "zipCode": 4410,
    "city": "Liestal",
    "lat": 47.4846,
    "long": 7.7345
  },
  {
    "zipCode": 4411,
    "city": "Seltisberg",
    "lat": 47.4595,
    "long": 7.7173
  },
  {
    "zipCode": 4412,
    "city": "Nuglar",
    "lat": 47.4727,
    "long": 7.6938
  },
  {
    "zipCode": 4413,
    "city": "Büren SO",
    "lat": 47.447,
    "long": 7.6706
  },
  {
    "zipCode": 4414,
    "city": "Füllinsdorf",
    "lat": 47.5069,
    "long": 7.7313
  },
  {
    "zipCode": 4415,
    "city": "Lausen",
    "lat": 47.4714,
    "long": 7.7603
  },
  {
    "zipCode": 4416,
    "city": "Bubendorf",
    "lat": 47.4459,
    "long": 7.7376
  },
  {
    "zipCode": 4417,
    "city": "Ziefen",
    "lat": 47.4292,
    "long": 7.7053
  },
  {
    "zipCode": 4418,
    "city": "Reigoldswil",
    "lat": 47.3982,
    "long": 7.6872
  },
  {
    "zipCode": 4419,
    "city": "Lupsingen",
    "lat": 47.4463,
    "long": 7.6961
  },
  {
    "zipCode": 4421,
    "city": "St. Pantaleon",
    "lat": 47.461,
    "long": 7.6918
  },
  {
    "zipCode": 4422,
    "city": "Arisdorf",
    "lat": 47.5132,
    "long": 7.7651
  },
  {
    "zipCode": 4423,
    "city": "Hersberg",
    "lat": 47.4921,
    "long": 7.7831
  },
  {
    "zipCode": 4424,
    "city": "Arboldswil",
    "lat": 47.4144,
    "long": 7.7176
  },
  {
    "zipCode": 4425,
    "city": "Titterten",
    "lat": 47.4021,
    "long": 7.7162
  },
  {
    "zipCode": 4426,
    "city": "Lauwil",
    "lat": 47.39,
    "long": 7.6749
  },
  {
    "zipCode": 4431,
    "city": "Bennwil",
    "lat": 47.4032,
    "long": 7.7799
  },
  {
    "zipCode": 4432,
    "city": "Lampenberg",
    "lat": 47.4256,
    "long": 7.7588
  },
  {
    "zipCode": 4433,
    "city": "Ramlinsburg",
    "lat": 47.4491,
    "long": 7.7696
  },
  {
    "zipCode": 4434,
    "city": "Hölstein",
    "lat": 47.4251,
    "long": 7.7714
  },
  {
    "zipCode": 4435,
    "city": "Niederdorf",
    "lat": 47.4095,
    "long": 7.7496
  },
  {
    "zipCode": 4436,
    "city": "Liedertswil",
    "lat": 47.3905,
    "long": 7.7207
  },
  {
    "zipCode": 4436,
    "city": "Oberdorf BL",
    "lat": 47.3931,
    "long": 7.7512
  },
  {
    "zipCode": 4437,
    "city": "Waldenburg",
    "lat": 47.3833,
    "long": 7.75
  },
  {
    "zipCode": 4438,
    "city": "Langenbruck",
    "lat": 47.3492,
    "long": 7.768
  },
  {
    "zipCode": 4441,
    "city": "Thürnen",
    "lat": 47.4531,
    "long": 7.8288
  },
  {
    "zipCode": 4442,
    "city": "Diepflingen",
    "lat": 47.4444,
    "long": 7.8364
  },
  {
    "zipCode": 4443,
    "city": "Wittinsburg",
    "lat": 47.4252,
    "long": 7.8413
  },
  {
    "zipCode": 4444,
    "city": "Rümlingen",
    "lat": 47.424,
    "long": 7.8479
  },
  {
    "zipCode": 4445,
    "city": "Häfelfingen",
    "lat": 47.4149,
    "long": 7.866
  },
  {
    "zipCode": 4446,
    "city": "Buckten",
    "lat": 47.4099,
    "long": 7.8448
  },
  {
    "zipCode": 4447,
    "city": "Känerkinden",
    "lat": 47.4119,
    "long": 7.8372
  },
  {
    "zipCode": 4448,
    "city": "Läufelfingen",
    "lat": 47.3946,
    "long": 7.8558
  },
  {
    "zipCode": 4450,
    "city": "Sissach",
    "lat": 47.4641,
    "long": 7.8089
  },
  {
    "zipCode": 4451,
    "city": "Wintersingen",
    "lat": 47.4941,
    "long": 7.8241
  },
  {
    "zipCode": 4452,
    "city": "Itingen",
    "lat": 47.4665,
    "long": 7.785
  },
  {
    "zipCode": 4453,
    "city": "Nusshof",
    "lat": 47.4914,
    "long": 7.8007
  },
  {
    "zipCode": 4455,
    "city": "Zunzgen",
    "lat": 47.4492,
    "long": 7.8079
  },
  {
    "zipCode": 4456,
    "city": "Tenniken",
    "lat": 47.4371,
    "long": 7.8115
  },
  {
    "zipCode": 4457,
    "city": "Diegten",
    "lat": 47.4138,
    "long": 7.8109
  },
  {
    "zipCode": 4458,
    "city": "Eptingen",
    "lat": 47.3847,
    "long": 7.819
  },
  {
    "zipCode": 4460,
    "city": "Gelterkinden",
    "lat": 47.465,
    "long": 7.8517
  },
  {
    "zipCode": 4461,
    "city": "Böckten",
    "lat": 47.4654,
    "long": 7.8326
  },
  {
    "zipCode": 4462,
    "city": "Rickenbach BL",
    "lat": 47.486,
    "long": 7.8474
  },
  {
    "zipCode": 4463,
    "city": "Buus",
    "lat": 47.5054,
    "long": 7.8648
  },
  {
    "zipCode": 4464,
    "city": "Maisprach",
    "lat": 47.5246,
    "long": 7.847
  },
  {
    "zipCode": 4465,
    "city": "Hemmiken",
    "lat": 47.4888,
    "long": 7.8938
  },
  {
    "zipCode": 4466,
    "city": "Ormalingen",
    "lat": 47.4694,
    "long": 7.8725
  },
  {
    "zipCode": 4467,
    "city": "Rothenfluh",
    "lat": 47.4626,
    "long": 7.9163
  },
  {
    "zipCode": 4468,
    "city": "Kienberg",
    "lat": 47.4383,
    "long": 7.9638
  },
  {
    "zipCode": 4469,
    "city": "Anwil",
    "lat": 47.453,
    "long": 7.9419
  },
  {
    "zipCode": 4492,
    "city": "Tecknau",
    "lat": 47.4513,
    "long": 7.884
  },
  {
    "zipCode": 4493,
    "city": "Wenslingen",
    "lat": 47.4407,
    "long": 7.9075
  },
  {
    "zipCode": 4494,
    "city": "Oltingen",
    "lat": 47.4302,
    "long": 7.9372
  },
  {
    "zipCode": 4495,
    "city": "Zeglingen",
    "lat": 47.4163,
    "long": 7.9048
  },
  {
    "zipCode": 4496,
    "city": "Kilchberg BL",
    "lat": 47.4249,
    "long": 7.894
  },
  {
    "zipCode": 4497,
    "city": "Rünenberg",
    "lat": 47.4348,
    "long": 7.8829
  },
  {
    "zipCode": 4500,
    "city": "Soleure",
    "lat": 47.2079,
    "long": 7.5371
  },
  {
    "zipCode": 4501,
    "city": "Solothurn",
    "lat": 47.2084,
    "long": 7.5301
  },
  {
    "zipCode": 4502,
    "city": "Solothurn",
    "lat": 47.2084,
    "long": 7.5301
  },
  {
    "zipCode": 4503,
    "city": "Solothurn",
    "lat": 47.2084,
    "long": 7.5301
  },
  {
    "zipCode": 4509,
    "city": "Solothurn",
    "lat": 47.2084,
    "long": 7.5301
  },
  {
    "zipCode": 4512,
    "city": "Bellach",
    "lat": 47.2136,
    "long": 7.4992
  },
  {
    "zipCode": 4513,
    "city": "Langendorf",
    "lat": 47.2197,
    "long": 7.5147
  },
  {
    "zipCode": 4514,
    "city": "Lommiswil",
    "lat": 47.2236,
    "long": 7.4714
  },
  {
    "zipCode": 4515,
    "city": "Oberdorf SO",
    "lat": 47.2305,
    "long": 7.5064
  },
  {
    "zipCode": 4515,
    "city": "Weissenstein b. Solothurn",
    "lat": 47.2305,
    "long": 7.5064
  },
  {
    "zipCode": 4522,
    "city": "Rüttenen",
    "lat": 47.2305,
    "long": 7.5295
  },
  {
    "zipCode": 4523,
    "city": "Niederwil SO",
    "lat": 47.252,
    "long": 7.5713
  },
  {
    "zipCode": 4524,
    "city": "Günsberg",
    "lat": 47.2567,
    "long": 7.5769
  },
  {
    "zipCode": 4524,
    "city": "Oberbalmberg",
    "lat": 47.2606,
    "long": 7.5592
  },
  {
    "zipCode": 4524,
    "city": "Balmberg",
    "lat": 47.2644,
    "long": 7.5415
  },
  {
    "zipCode": 4525,
    "city": "Balm b. Günsberg",
    "lat": 47.2531,
    "long": 7.5583
  },
  {
    "zipCode": 4528,
    "city": "Zuchwil",
    "lat": 47.2017,
    "long": 7.5665
  },
  {
    "zipCode": 4532,
    "city": "Feldbrunnen",
    "lat": 47.2202,
    "long": 7.5549
  },
  {
    "zipCode": 4533,
    "city": "Riedholz",
    "lat": 47.2316,
    "long": 7.5683
  },
  {
    "zipCode": 4534,
    "city": "Flumenthal",
    "lat": 47.2355,
    "long": 7.5985
  },
  {
    "zipCode": 4535,
    "city": "Kammersrohr",
    "lat": 47.253,
    "long": 7.5932
  },
  {
    "zipCode": 4535,
    "city": "Hubersdorf",
    "lat": 47.2463,
    "long": 7.5894
  },
  {
    "zipCode": 4536,
    "city": "Attiswil",
    "lat": 47.2467,
    "long": 7.6135
  },
  {
    "zipCode": 4537,
    "city": "Wiedlisbach",
    "lat": 47.2519,
    "long": 7.6461
  },
  {
    "zipCode": 4538,
    "city": "Oberbipp",
    "lat": 47.2607,
    "long": 7.6636
  },
  {
    "zipCode": 4539,
    "city": "Rumisberg",
    "lat": 47.2641,
    "long": 7.6403
  },
  {
    "zipCode": 4539,
    "city": "Farnern",
    "lat": 47.2669,
    "long": 7.6178
  },
  {
    "zipCode": 4542,
    "city": "Luterbach",
    "lat": 47.2143,
    "long": 7.5846
  },
  {
    "zipCode": 4543,
    "city": "Deitingen",
    "lat": 47.2158,
    "long": 7.6199
  },
  {
    "zipCode": 4551,
    "city": "Derendingen",
    "lat": 47.1919,
    "long": 7.5899
  },
  {
    "zipCode": 4552,
    "city": "Derendingen",
    "lat": 47.1985,
    "long": 7.5884
  },
  {
    "zipCode": 4553,
    "city": "Subingen",
    "lat": 47.1985,
    "long": 7.6195
  },
  {
    "zipCode": 4554,
    "city": "Hüniken",
    "lat": 47.1847,
    "long": 7.6363
  },
  {
    "zipCode": 4554,
    "city": "Etziken",
    "lat": 47.1876,
    "long": 7.6478
  },
  {
    "zipCode": 4556,
    "city": "Steinhof SO",
    "lat": 47.1612,
    "long": 7.6867
  },
  {
    "zipCode": 4556,
    "city": "Bolken",
    "lat": 47.1912,
    "long": 7.663
  },
  {
    "zipCode": 4556,
    "city": "Aeschi SO",
    "lat": 47.1798,
    "long": 7.6614
  },
  {
    "zipCode": 4556,
    "city": "Burgäschi",
    "lat": 47.1774,
    "long": 7.6704
  },
  {
    "zipCode": 4557,
    "city": "Horriwil",
    "lat": 47.1823,
    "long": 7.6219
  },
  {
    "zipCode": 4558,
    "city": "Hersiwil",
    "lat": 47.1661,
    "long": 7.6352
  },
  {
    "zipCode": 4558,
    "city": "Heinrichswil",
    "lat": 47.1579,
    "long": 7.6351
  },
  {
    "zipCode": 4558,
    "city": "Winistorf",
    "lat": 47.1579,
    "long": 7.6351
  },
  {
    "zipCode": 4562,
    "city": "Biberist",
    "lat": 47.1801,
    "long": 7.5625
  },
  {
    "zipCode": 4563,
    "city": "Gerlafingen",
    "lat": 47.1698,
    "long": 7.5751
  },
  {
    "zipCode": 4564,
    "city": "Zielebach",
    "lat": 47.158,
    "long": 7.5729
  },
  {
    "zipCode": 4564,
    "city": "Obergerlafingen",
    "lat": 47.1612,
    "long": 7.5818
  },
  {
    "zipCode": 4565,
    "city": "Recherswil",
    "lat": 47.1626,
    "long": 7.5946
  },
  {
    "zipCode": 4566,
    "city": "Oekingen",
    "lat": 47.1798,
    "long": 7.6024
  },
  {
    "zipCode": 4566,
    "city": "Kriegstetten",
    "lat": 47.1745,
    "long": 7.598
  },
  {
    "zipCode": 4566,
    "city": "Halten",
    "lat": 47.1688,
    "long": 7.6035
  },
  {
    "zipCode": 4571,
    "city": "Lüterkofen",
    "lat": 47.1653,
    "long": 7.5106
  },
  {
    "zipCode": 4571,
    "city": "Ichertswil",
    "lat": 47.1614,
    "long": 7.5001
  },
  {
    "zipCode": 4573,
    "city": "Lohn-Ammannsegg",
    "lat": 47.1714,
    "long": 7.5294
  },
  {
    "zipCode": 4574,
    "city": "Lüsslingen",
    "lat": 47.19,
    "long": 7.5017
  },
  {
    "zipCode": 4574,
    "city": "Nennigkofen",
    "lat": 47.1863,
    "long": 7.4952
  },
  {
    "zipCode": 4576,
    "city": "Tscheppach",
    "lat": 47.1487,
    "long": 7.4827
  },
  {
    "zipCode": 4577,
    "city": "Hessigkofen",
    "lat": 47.1413,
    "long": 7.4667
  },
  {
    "zipCode": 4578,
    "city": "Bibern SO",
    "lat": 47.1469,
    "long": 7.4576
  },
  {
    "zipCode": 4579,
    "city": "Gossliwil",
    "lat": 47.1367,
    "long": 7.4344
  },
  {
    "zipCode": 4581,
    "city": "Küttigkofen",
    "lat": 47.1514,
    "long": 7.5155
  },
  {
    "zipCode": 4582,
    "city": "Brügglen",
    "lat": 47.1424,
    "long": 7.4962
  },
  {
    "zipCode": 4583,
    "city": "Aetigkofen",
    "lat": 47.1257,
    "long": 7.4645
  },
  {
    "zipCode": 4583,
    "city": "Mühledorf SO",
    "lat": 47.1346,
    "long": 7.4766
  },
  {
    "zipCode": 4584,
    "city": "Lüterswil",
    "lat": 47.1222,
    "long": 7.4391
  },
  {
    "zipCode": 4584,
    "city": "Gächliwil",
    "lat": 47.1222,
    "long": 7.4391
  },
  {
    "zipCode": 4585,
    "city": "Biezwil",
    "lat": 47.1165,
    "long": 7.4155
  },
  {
    "zipCode": 4586,
    "city": "Kyburg-Buchegg",
    "lat": 47.1425,
    "long": 7.5098
  },
  {
    "zipCode": 4587,
    "city": "Aetingen",
    "lat": 47.1322,
    "long": 7.5059
  },
  {
    "zipCode": 4588,
    "city": "Brittern",
    "lat": 47.122,
    "long": 7.4926
  },
  {
    "zipCode": 4588,
    "city": "Oberramsern",
    "lat": 47.0961,
    "long": 7.4504
  },
  {
    "zipCode": 4588,
    "city": "Unterramsern",
    "lat": 47.1177,
    "long": 7.4827
  },
  {
    "zipCode": 4600,
    "city": "Olten",
    "lat": 47.35,
    "long": 7.9033
  },
  {
    "zipCode": 4601,
    "city": "Olten 1 Fächer",
    "lat": 47.3448,
    "long": 7.9001
  },
  {
    "zipCode": 4609,
    "city": "Olten",
    "lat": 47.3448,
    "long": 7.9001
  },
  {
    "zipCode": 4612,
    "city": "Wangen b. Olten",
    "lat": 47.3437,
    "long": 7.8698
  },
  {
    "zipCode": 4613,
    "city": "Rickenbach SO",
    "lat": 47.3424,
    "long": 7.8547
  },
  {
    "zipCode": 4614,
    "city": "Hägendorf",
    "lat": 47.3344,
    "long": 7.8419
  },
  {
    "zipCode": 4615,
    "city": "Allerheiligenberg",
    "lat": 47.3524,
    "long": 7.8153
  },
  {
    "zipCode": 4616,
    "city": "Kappel SO",
    "lat": 47.3247,
    "long": 7.8465
  },
  {
    "zipCode": 4617,
    "city": "Gunzgen",
    "lat": 47.3137,
    "long": 7.831
  },
  {
    "zipCode": 4618,
    "city": "Boningen",
    "lat": 47.3086,
    "long": 7.8553
  },
  {
    "zipCode": 4622,
    "city": "Egerkingen",
    "lat": 47.3196,
    "long": 7.7842
  },
  {
    "zipCode": 4623,
    "city": "Neuendorf",
    "lat": 47.3008,
    "long": 7.7954
  },
  {
    "zipCode": 4624,
    "city": "Härkingen",
    "lat": 47.3089,
    "long": 7.8181
  },
  {
    "zipCode": 4625,
    "city": "Oberbuchsiten",
    "lat": 47.3133,
    "long": 7.7684
  },
  {
    "zipCode": 4626,
    "city": "Niederbuchsiten",
    "lat": 47.2965,
    "long": 7.7718
  },
  {
    "zipCode": 4628,
    "city": "Wolfwil",
    "lat": 47.2682,
    "long": 7.7897
  },
  {
    "zipCode": 4629,
    "city": "Fulenbach",
    "lat": 47.275,
    "long": 7.8334
  },
  {
    "zipCode": 4632,
    "city": "Trimbach",
    "lat": 47.3656,
    "long": 7.8868
  },
  {
    "zipCode": 4633,
    "city": "Hauenstein",
    "lat": 47.3779,
    "long": 7.8721
  },
  {
    "zipCode": 4634,
    "city": "Wisen SO",
    "lat": 47.3928,
    "long": 7.8851
  },
  {
    "zipCode": 4652,
    "city": "Winznau",
    "lat": 47.3636,
    "long": 7.9301
  },
  {
    "zipCode": 4653,
    "city": "Obergösgen",
    "lat": 47.3566,
    "long": 7.956
  },
  {
    "zipCode": 4654,
    "city": "Lostorf",
    "lat": 47.3837,
    "long": 7.9466
  },
  {
    "zipCode": 4655,
    "city": "Stüsslingen",
    "lat": 47.3949,
    "long": 7.9695
  },
  {
    "zipCode": 4655,
    "city": "Rohr b. Olten",
    "lat": 47.4116,
    "long": 7.9529
  },
  {
    "zipCode": 4656,
    "city": "Starrkirch-Wil",
    "lat": 47.3478,
    "long": 7.9274
  },
  {
    "zipCode": 4657,
    "city": "Dulliken",
    "lat": 47.3481,
    "long": 7.9464
  },
  {
    "zipCode": 4658,
    "city": "Däniken SO",
    "lat": 47.3532,
    "long": 7.9874
  },
  {
    "zipCode": 4663,
    "city": "Aarburg",
    "lat": 47.3207,
    "long": 7.8999
  },
  {
    "zipCode": 4665,
    "city": "Oftringen",
    "lat": 47.3138,
    "long": 7.9253
  },
  {
    "zipCode": 4702,
    "city": "Oensingen",
    "lat": 47.2864,
    "long": 7.7231
  },
  {
    "zipCode": 4703,
    "city": "Kestenholz",
    "lat": 47.2804,
    "long": 7.7529
  },
  {
    "zipCode": 4704,
    "city": "Niederbipp",
    "lat": 47.2661,
    "long": 7.6946
  },
  {
    "zipCode": 4704,
    "city": "Wolfisberg",
    "lat": 47.2748,
    "long": 7.6599
  },
  {
    "zipCode": 4710,
    "city": "Balsthal",
    "lat": 47.3161,
    "long": 7.6932
  },
  {
    "zipCode": 4712,
    "city": "Laupersdorf",
    "lat": 47.3143,
    "long": 7.6505
  },
  {
    "zipCode": 4713,
    "city": "Matzendorf",
    "lat": 47.3037,
    "long": 7.6282
  },
  {
    "zipCode": 4714,
    "city": "Aedermannsdorf",
    "lat": 47.3037,
    "long": 7.6105
  },
  {
    "zipCode": 4715,
    "city": "Herbetswil",
    "lat": 47.296,
    "long": 7.592
  },
  {
    "zipCode": 4716,
    "city": "Gänsbrunnen",
    "lat": 47.2612,
    "long": 7.4686
  },
  {
    "zipCode": 4716,
    "city": "Welschenrohr",
    "lat": 47.2803,
    "long": 7.5263
  },
  {
    "zipCode": 4717,
    "city": "Mümliswil",
    "lat": 47.3441,
    "long": 7.7035
  },
  {
    "zipCode": 4718,
    "city": "Holderbank SO",
    "lat": 47.3325,
    "long": 7.7497
  },
  {
    "zipCode": 4719,
    "city": "Ramiswil",
    "lat": 47.3451,
    "long": 7.6607
  },
  {
    "zipCode": 4800,
    "city": "Zofingen",
    "lat": 47.2878,
    "long": 7.9459
  },
  {
    "zipCode": 4801,
    "city": "Zofingen",
    "lat": 47.2888,
    "long": 7.9633
  },
  {
    "zipCode": 4802,
    "city": "Strengelbach",
    "lat": 47.2792,
    "long": 7.929
  },
  {
    "zipCode": 4803,
    "city": "Vordemwald",
    "lat": 47.2759,
    "long": 7.9011
  },
  {
    "zipCode": 4805,
    "city": "Brittnau",
    "lat": 47.2595,
    "long": 7.9469
  },
  {
    "zipCode": 4806,
    "city": "Wikon",
    "lat": 47.2634,
    "long": 7.968
  },
  {
    "zipCode": 4807,
    "city": "Zofingen PF",
    "lat": 47.2888,
    "long": 7.9633
  },
  {
    "zipCode": 4808,
    "city": "Zofingen PF",
    "lat": 47.2888,
    "long": 7.9633
  },
  {
    "zipCode": 4809,
    "city": "Zofingen PF UBS",
    "lat": 47.2888,
    "long": 7.9633
  },
  {
    "zipCode": 4809,
    "city": "Zofingen PF",
    "lat": 47.2888,
    "long": 7.9633
  },
  {
    "zipCode": 4812,
    "city": "Mühlethal",
    "lat": 47.3028,
    "long": 7.9792
  },
  {
    "zipCode": 4813,
    "city": "Uerkheim",
    "lat": 47.3029,
    "long": 8.0237
  },
  {
    "zipCode": 4814,
    "city": "Bottenwil",
    "lat": 47.2854,
    "long": 8.0046
  },
  {
    "zipCode": 4852,
    "city": "Rothrist",
    "lat": 47.3051,
    "long": 7.892
  },
  {
    "zipCode": 4853,
    "city": "Riken AG",
    "lat": 47.278,
    "long": 7.8508
  },
  {
    "zipCode": 4853,
    "city": "Murgenthal",
    "lat": 47.2677,
    "long": 7.8358
  },
  {
    "zipCode": 4853,
    "city": "Murgenthal",
    "lat": 47.2677,
    "long": 7.8358
  },
  {
    "zipCode": 4856,
    "city": "Glashütten",
    "lat": 47.2588,
    "long": 7.8446
  },
  {
    "zipCode": 4900,
    "city": "Langenthal",
    "lat": 47.2153,
    "long": 7.7961
  },
  {
    "zipCode": 4901,
    "city": "Langenthal",
    "lat": 47.2158,
    "long": 7.7945
  },
  {
    "zipCode": 4911,
    "city": "Schwarzhäusern",
    "lat": 47.2517,
    "long": 7.7655
  },
  {
    "zipCode": 4912,
    "city": "Aarwangen",
    "lat": 47.2385,
    "long": 7.7685
  },
  {
    "zipCode": 4913,
    "city": "Bannwil",
    "lat": 47.234,
    "long": 7.731
  },
  {
    "zipCode": 4914,
    "city": "Roggwil BE",
    "lat": 47.2412,
    "long": 7.8214
  },
  {
    "zipCode": 4915,
    "city": "St. Urban",
    "lat": 47.2318,
    "long": 7.8417
  },
  {
    "zipCode": 4916,
    "city": "Untersteckholz",
    "lat": 47.2076,
    "long": 7.8445
  },
  {
    "zipCode": 4917,
    "city": "Melchnau",
    "lat": 47.1821,
    "long": 7.8513
  },
  {
    "zipCode": 4917,
    "city": "Busswil b. Melchnau",
    "lat": 47.1876,
    "long": 7.8295
  },
  {
    "zipCode": 4919,
    "city": "Reisiswil",
    "lat": 47.1651,
    "long": 7.8463
  },
  {
    "zipCode": 4922,
    "city": "Thunstetten",
    "lat": 47.2027,
    "long": 7.7575
  },
  {
    "zipCode": 4922,
    "city": "Bützberg",
    "lat": 47.2141,
    "long": 7.7431
  },
  {
    "zipCode": 4923,
    "city": "Wynau",
    "lat": 47.2557,
    "long": 7.8163
  },
  {
    "zipCode": 4924,
    "city": "Obersteckholz",
    "lat": 47.1993,
    "long": 7.8171
  },
  {
    "zipCode": 4932,
    "city": "Gutenburg",
    "lat": 47.1838,
    "long": 7.7948
  },
  {
    "zipCode": 4932,
    "city": "Lotzwil",
    "lat": 47.1913,
    "long": 7.791
  },
  {
    "zipCode": 4933,
    "city": "Rütschelen",
    "lat": 47.1711,
    "long": 7.7709
  },
  {
    "zipCode": 4934,
    "city": "Madiswil",
    "lat": 47.1646,
    "long": 7.7986
  },
  {
    "zipCode": 4935,
    "city": "Leimiswil",
    "lat": 47.1508,
    "long": 7.7634
  },
  {
    "zipCode": 4936,
    "city": "Kleindietwil",
    "lat": 47.1457,
    "long": 7.7896
  },
  {
    "zipCode": 4937,
    "city": "Ursenbach",
    "lat": 47.137,
    "long": 7.7719
  },
  {
    "zipCode": 4938,
    "city": "Rohrbachgraben",
    "lat": 47.1193,
    "long": 7.8004
  },
  {
    "zipCode": 4938,
    "city": "Rohrbach",
    "lat": 47.1352,
    "long": 7.8133
  },
  {
    "zipCode": 4942,
    "city": "Walterswil BE",
    "lat": 47.1122,
    "long": 7.778
  },
  {
    "zipCode": 4943,
    "city": "Oeschenbach",
    "lat": 47.1029,
    "long": 7.7476
  },
  {
    "zipCode": 4944,
    "city": "Auswil",
    "lat": 47.1436,
    "long": 7.8454
  },
  {
    "zipCode": 4950,
    "city": "Huttwil",
    "lat": 47.115,
    "long": 7.8621
  },
  {
    "zipCode": 4952,
    "city": "Eriswil",
    "lat": 47.0782,
    "long": 7.8515
  },
  {
    "zipCode": 4953,
    "city": "Schwarzenbach (Huttwil)",
    "lat": 47.108,
    "long": 7.8303
  },
  {
    "zipCode": 4954,
    "city": "Wyssachen",
    "lat": 47.0785,
    "long": 7.8292
  },
  {
    "zipCode": 4955,
    "city": "Gondiswil",
    "lat": 47.1468,
    "long": 7.8714
  },
  {
    "zipCode": 5000,
    "city": "Aarau",
    "lat": 47.3925,
    "long": 8.0442
  },
  {
    "zipCode": 5001,
    "city": "Aarau 1",
    "lat": 47.3888,
    "long": 8.0483
  },
  {
    "zipCode": 5004,
    "city": "Aarau",
    "lat": 47.3925,
    "long": 8.0442
  },
  {
    "zipCode": 5012,
    "city": "Eppenberg",
    "lat": 47.3774,
    "long": 8.0249
  },
  {
    "zipCode": 5012,
    "city": "Wöschnau",
    "lat": 47.3849,
    "long": 8.0255
  },
  {
    "zipCode": 5012,
    "city": "Schönenwerd",
    "lat": 47.3691,
    "long": 8.0017
  },
  {
    "zipCode": 5013,
    "city": "Niedergösgen",
    "lat": 47.3722,
    "long": 7.9912
  },
  {
    "zipCode": 5014,
    "city": "Gretzenbach",
    "lat": 47.3582,
    "long": 8.0024
  },
  {
    "zipCode": 5015,
    "city": "Erlinsbach SO",
    "lat": 47.4,
    "long": 8
  },
  {
    "zipCode": 5017,
    "city": "Barmelweid",
    "lat": 47.4159,
    "long": 7.9764
  },
  {
    "zipCode": 5018,
    "city": "Erlinsbach",
    "lat": 47.4052,
    "long": 8.0151
  },
  {
    "zipCode": 5022,
    "city": "Rombach",
    "lat": 47.4047,
    "long": 8.0459
  },
  {
    "zipCode": 5023,
    "city": "Biberstein",
    "lat": 47.4164,
    "long": 8.0851
  },
  {
    "zipCode": 5024,
    "city": "Küttigen",
    "lat": 47.4157,
    "long": 8.0477
  },
  {
    "zipCode": 5025,
    "city": "Asp",
    "lat": 47.445,
    "long": 8.0503
  },
  {
    "zipCode": 5026,
    "city": "Densbüren",
    "lat": 47.4526,
    "long": 8.0533
  },
  {
    "zipCode": 5027,
    "city": "Herznach",
    "lat": 47.4715,
    "long": 8.0475
  },
  {
    "zipCode": 5028,
    "city": "Ueken",
    "lat": 47.4845,
    "long": 8.0444
  },
  {
    "zipCode": 5032,
    "city": "Aarau Rohr",
    "lat": 47.4017,
    "long": 8.0796
  },
  {
    "zipCode": 5033,
    "city": "Buchs AG",
    "lat": 47.3936,
    "long": 8.0823
  },
  {
    "zipCode": 5034,
    "city": "Suhr",
    "lat": 47.3717,
    "long": 8.0797
  },
  {
    "zipCode": 5035,
    "city": "Unterentfelden",
    "lat": 47.3681,
    "long": 8.0502
  },
  {
    "zipCode": 5036,
    "city": "Oberentfelden",
    "lat": 47.3564,
    "long": 8.0459
  },
  {
    "zipCode": 5037,
    "city": "Muhen",
    "lat": 47.3367,
    "long": 8.0541
  },
  {
    "zipCode": 5040,
    "city": "Schöftland",
    "lat": 47.3057,
    "long": 8.0514
  },
  {
    "zipCode": 5042,
    "city": "Hirschthal",
    "lat": 47.3187,
    "long": 8.0564
  },
  {
    "zipCode": 5043,
    "city": "Holziken",
    "lat": 47.3195,
    "long": 8.0343
  },
  {
    "zipCode": 5044,
    "city": "Schlossrued",
    "lat": 47.2912,
    "long": 8.0884
  },
  {
    "zipCode": 5046,
    "city": "Schmiedrued",
    "lat": 47.2626,
    "long": 8.1118
  },
  {
    "zipCode": 5046,
    "city": "Walde AG",
    "lat": 47.2626,
    "long": 8.1118
  },
  {
    "zipCode": 5053,
    "city": "Staffelbach",
    "lat": 47.2839,
    "long": 8.0421
  },
  {
    "zipCode": 5053,
    "city": "Wittwil",
    "lat": 47.2919,
    "long": 8.0364
  },
  {
    "zipCode": 5054,
    "city": "Moosleerau",
    "lat": 47.269,
    "long": 8.0641
  },
  {
    "zipCode": 5054,
    "city": "Kirchleerau",
    "lat": 47.2758,
    "long": 8.0658
  },
  {
    "zipCode": 5056,
    "city": "Attelwil",
    "lat": 47.2634,
    "long": 8.0397
  },
  {
    "zipCode": 5057,
    "city": "Reitnau",
    "lat": 47.2522,
    "long": 8.0422
  },
  {
    "zipCode": 5058,
    "city": "Wiliberg",
    "lat": 47.2687,
    "long": 8.0214
  },
  {
    "zipCode": 5062,
    "city": "Oberhof",
    "lat": 47.4487,
    "long": 8.0027
  },
  {
    "zipCode": 5063,
    "city": "Wölflinswil",
    "lat": 47.4607,
    "long": 7.9984
  },
  {
    "zipCode": 5064,
    "city": "Wittnau",
    "lat": 47.4814,
    "long": 7.9758
  },
  {
    "zipCode": 5070,
    "city": "Frick",
    "lat": 47.5117,
    "long": 8.0247
  },
  {
    "zipCode": 5072,
    "city": "Oeschgen",
    "lat": 47.5231,
    "long": 8.019
  },
  {
    "zipCode": 5073,
    "city": "Gipf-Oberfrick",
    "lat": 47.4988,
    "long": 8.005
  },
  {
    "zipCode": 5074,
    "city": "Eiken",
    "lat": 47.5339,
    "long": 7.9888
  },
  {
    "zipCode": 5075,
    "city": "Hornussen",
    "lat": 47.5003,
    "long": 8.0613
  },
  {
    "zipCode": 5076,
    "city": "Bözen",
    "lat": 47.4778,
    "long": 8.1646
  },
  {
    "zipCode": 5077,
    "city": "Elfingen",
    "lat": 47.5085,
    "long": 8.0995
  },
  {
    "zipCode": 5078,
    "city": "Effingen",
    "lat": 47.4887,
    "long": 8.1029
  },
  {
    "zipCode": 5079,
    "city": "Zeihen",
    "lat": 47.4754,
    "long": 8.0831
  },
  {
    "zipCode": 5080,
    "city": "Laufenburg",
    "lat": 47.5598,
    "long": 8.0622
  },
  {
    "zipCode": 5082,
    "city": "Kaisten",
    "lat": 47.5416,
    "long": 8.0434
  },
  {
    "zipCode": 5083,
    "city": "Ittenthal",
    "lat": 47.5183,
    "long": 8.0596
  },
  {
    "zipCode": 5084,
    "city": "Rheinsulz",
    "lat": 47.5556,
    "long": 8.0899
  },
  {
    "zipCode": 5085,
    "city": "Sulz AG",
    "lat": 47.536,
    "long": 8.0963
  },
  {
    "zipCode": 5102,
    "city": "Rupperswil",
    "lat": 47.4013,
    "long": 8.1288
  },
  {
    "zipCode": 5103,
    "city": "Wildegg",
    "lat": 47.4147,
    "long": 8.1636
  },
  {
    "zipCode": 5103,
    "city": "Möriken AG",
    "lat": 47.4156,
    "long": 8.1845
  },
  {
    "zipCode": 5105,
    "city": "Auenstein",
    "lat": 47.4156,
    "long": 8.1345
  },
  {
    "zipCode": 5106,
    "city": "Veltheim AG",
    "lat": 47.438,
    "long": 8.1472
  },
  {
    "zipCode": 5107,
    "city": "Schinznach Dorf",
    "lat": 47.4465,
    "long": 8.1409
  },
  {
    "zipCode": 5108,
    "city": "Oberflachs",
    "lat": 47.4402,
    "long": 8.1252
  },
  {
    "zipCode": 5112,
    "city": "Thalheim AG",
    "lat": 47.4353,
    "long": 8.1003
  },
  {
    "zipCode": 5113,
    "city": "Holderbank AG",
    "lat": 47.4309,
    "long": 8.1707
  },
  {
    "zipCode": 5116,
    "city": "Schinznach Bad",
    "lat": 47.4499,
    "long": 8.1683
  },
  {
    "zipCode": 5200,
    "city": "Brugg AG",
    "lat": 47.481,
    "long": 8.2087
  },
  {
    "zipCode": 5201,
    "city": "Brugg AG",
    "lat": 47.4863,
    "long": 8.211
  },
  {
    "zipCode": 5210,
    "city": "Windisch",
    "lat": 47.479,
    "long": 8.2184
  },
  {
    "zipCode": 5212,
    "city": "Hausen AG",
    "lat": 47.464,
    "long": 8.2099
  },
  {
    "zipCode": 5213,
    "city": "Villnachern",
    "lat": 47.471,
    "long": 8.1598
  },
  {
    "zipCode": 5222,
    "city": "Umiken",
    "lat": 47.4829,
    "long": 8.1875
  },
  {
    "zipCode": 5223,
    "city": "Riniken",
    "lat": 47.494,
    "long": 8.1867
  },
  {
    "zipCode": 5225,
    "city": "Bözberg",
    "lat": 47.4955,
    "long": 8.1514
  },
  {
    "zipCode": 5232,
    "city": "Villigen PSI",
    "lat": 47.5296,
    "long": 8.2072
  },
  {
    "zipCode": 5233,
    "city": "Stilli",
    "lat": 47.5172,
    "long": 8.2316
  },
  {
    "zipCode": 5234,
    "city": "Villigen",
    "lat": 47.5268,
    "long": 8.2149
  },
  {
    "zipCode": 5235,
    "city": "Rüfenach AG",
    "lat": 47.5071,
    "long": 8.209
  },
  {
    "zipCode": 5236,
    "city": "Remigen",
    "lat": 47.5186,
    "long": 8.185
  },
  {
    "zipCode": 5237,
    "city": "Mönthal",
    "lat": 47.517,
    "long": 8.1404
  },
  {
    "zipCode": 5242,
    "city": "Birr",
    "lat": 47.4359,
    "long": 8.208
  },
  {
    "zipCode": 5242,
    "city": "Lupfig",
    "lat": 47.4407,
    "long": 8.2038
  },
  {
    "zipCode": 5243,
    "city": "Mülligen",
    "lat": 47.4558,
    "long": 8.2392
  },
  {
    "zipCode": 5244,
    "city": "Birrhard",
    "lat": 47.4328,
    "long": 8.245
  },
  {
    "zipCode": 5245,
    "city": "Habsburg",
    "lat": 47.4623,
    "long": 8.185
  },
  {
    "zipCode": 5246,
    "city": "Scherz",
    "lat": 47.4469,
    "long": 8.1842
  },
  {
    "zipCode": 5272,
    "city": "Gansingen",
    "lat": 47.5429,
    "long": 8.1352
  },
  {
    "zipCode": 5273,
    "city": "Oberhofen AG",
    "lat": 47.5538,
    "long": 8.1332
  },
  {
    "zipCode": 5274,
    "city": "Mettau",
    "lat": 47.5636,
    "long": 8.1293
  },
  {
    "zipCode": 5275,
    "city": "Etzgen",
    "lat": 47.5713,
    "long": 8.1106
  },
  {
    "zipCode": 5276,
    "city": "Wil AG",
    "lat": 47.5606,
    "long": 8.1525
  },
  {
    "zipCode": 5277,
    "city": "Hottwil",
    "lat": 47.5484,
    "long": 8.1617
  },
  {
    "zipCode": 5300,
    "city": "Turgi",
    "lat": 47.492,
    "long": 8.2541
  },
  {
    "zipCode": 5301,
    "city": "Siggenthal Station",
    "lat": 47.5174,
    "long": 8.2395
  },
  {
    "zipCode": 5303,
    "city": "Würenlingen",
    "lat": 47.5336,
    "long": 8.2567
  },
  {
    "zipCode": 5304,
    "city": "Endingen",
    "lat": 47.5389,
    "long": 8.2903
  },
  {
    "zipCode": 5305,
    "city": "Unterendingen",
    "lat": 47.5486,
    "long": 8.2917
  },
  {
    "zipCode": 5306,
    "city": "Tegerfelden",
    "lat": 47.5581,
    "long": 8.2891
  },
  {
    "zipCode": 5312,
    "city": "Döttingen",
    "lat": 47.5709,
    "long": 8.2585
  },
  {
    "zipCode": 5313,
    "city": "Klingnau",
    "lat": 47.5836,
    "long": 8.2488
  },
  {
    "zipCode": 5314,
    "city": "Kleindöttingen",
    "lat": 47.5709,
    "long": 8.2465
  },
  {
    "zipCode": 5315,
    "city": "Böttstein",
    "lat": 47.5554,
    "long": 8.2226
  },
  {
    "zipCode": 5316,
    "city": "Leuggern",
    "lat": 47.5819,
    "long": 8.2195
  },
  {
    "zipCode": 5317,
    "city": "Hettenschwil",
    "lat": 47.5786,
    "long": 8.2003
  },
  {
    "zipCode": 5318,
    "city": "Mandach",
    "lat": 47.5478,
    "long": 8.189
  },
  {
    "zipCode": 5322,
    "city": "Koblenz",
    "lat": 47.6097,
    "long": 8.2375
  },
  {
    "zipCode": 5323,
    "city": "Rietheim",
    "lat": 47.6,
    "long": 8.2833
  },
  {
    "zipCode": 5324,
    "city": "Full-Reuenthal",
    "lat": 47.6087,
    "long": 8.2027
  },
  {
    "zipCode": 5325,
    "city": "Leibstadt",
    "lat": 47.5879,
    "long": 8.1761
  },
  {
    "zipCode": 5326,
    "city": "Schwaderloch",
    "lat": 47.5854,
    "long": 8.1446
  },
  {
    "zipCode": 5330,
    "city": "Bad Zurzach",
    "lat": 47.5876,
    "long": 8.2936
  },
  {
    "zipCode": 5332,
    "city": "Rekingen AG",
    "lat": 47.5719,
    "long": 8.3178
  },
  {
    "zipCode": 5333,
    "city": "Baldingen",
    "lat": 47.5556,
    "long": 8.3167
  },
  {
    "zipCode": 5334,
    "city": "Böbikon",
    "lat": 47.5556,
    "long": 8.3347
  },
  {
    "zipCode": 5400,
    "city": "Baden",
    "lat": 47.4733,
    "long": 8.3059
  },
  {
    "zipCode": 5401,
    "city": "Baden",
    "lat": 47.4651,
    "long": 8.2896
  },
  {
    "zipCode": 5402,
    "city": "Baden",
    "lat": 47.4651,
    "long": 8.2896
  },
  {
    "zipCode": 5404,
    "city": "Baden",
    "lat": 47.4733,
    "long": 8.3059
  },
  {
    "zipCode": 5405,
    "city": "Dättwil AG",
    "lat": 47.4551,
    "long": 8.2847
  },
  {
    "zipCode": 5406,
    "city": "Rütihof",
    "lat": 47.44,
    "long": 8.2712
  },
  {
    "zipCode": 5408,
    "city": "Ennetbaden",
    "lat": 47.4804,
    "long": 8.3235
  },
  {
    "zipCode": 5412,
    "city": "Vogelsang AG",
    "lat": 47.4943,
    "long": 8.2382
  },
  {
    "zipCode": 5412,
    "city": "Gebenstorf",
    "lat": 47.4814,
    "long": 8.2395
  },
  {
    "zipCode": 5413,
    "city": "Birmenstorf AG",
    "lat": 47.4615,
    "long": 8.2482
  },
  {
    "zipCode": 5415,
    "city": "Nussbaumen AG",
    "lat": 47.4872,
    "long": 8.2917
  },
  {
    "zipCode": 5415,
    "city": "Hertenstein AG",
    "lat": 47.4871,
    "long": 8.3115
  },
  {
    "zipCode": 5415,
    "city": "Rieden AG",
    "lat": 47.4846,
    "long": 8.3018
  },
  {
    "zipCode": 5416,
    "city": "Kirchdorf AG",
    "lat": 47.4966,
    "long": 8.2754
  },
  {
    "zipCode": 5417,
    "city": "Untersiggenthal",
    "lat": 47.5021,
    "long": 8.2555
  },
  {
    "zipCode": 5420,
    "city": "Ehrendingen",
    "lat": 47.5025,
    "long": 8.3473
  },
  {
    "zipCode": 5423,
    "city": "Freienwil",
    "lat": 47.503,
    "long": 8.3277
  },
  {
    "zipCode": 5425,
    "city": "Schneisingen",
    "lat": 47.5194,
    "long": 8.3667
  },
  {
    "zipCode": 5426,
    "city": "Lengnau AG",
    "lat": 47.5222,
    "long": 8.3306
  },
  {
    "zipCode": 5430,
    "city": "Wettingen",
    "lat": 47.4705,
    "long": 8.3164
  },
  {
    "zipCode": 5432,
    "city": "Neuenhof",
    "lat": 47.4526,
    "long": 8.3258
  },
  {
    "zipCode": 5436,
    "city": "Würenlos",
    "lat": 47.4421,
    "long": 8.3644
  },
  {
    "zipCode": 5442,
    "city": "Fislisbach",
    "lat": 47.439,
    "long": 8.2969
  },
  {
    "zipCode": 5443,
    "city": "Niederrohrdorf",
    "lat": 47.4235,
    "long": 8.3064
  },
  {
    "zipCode": 5444,
    "city": "Künten",
    "lat": 47.3889,
    "long": 8.331
  },
  {
    "zipCode": 5445,
    "city": "Eggenwil",
    "lat": 47.3704,
    "long": 8.3395
  },
  {
    "zipCode": 5452,
    "city": "Oberrohrdorf",
    "lat": 47.4183,
    "long": 8.3198
  },
  {
    "zipCode": 5453,
    "city": "Remetschwil",
    "lat": 47.4083,
    "long": 8.3319
  },
  {
    "zipCode": 5454,
    "city": "Bellikon",
    "lat": 47.3916,
    "long": 8.3493
  },
  {
    "zipCode": 5462,
    "city": "Siglistorf",
    "lat": 47.5453,
    "long": 8.3806
  },
  {
    "zipCode": 5463,
    "city": "Wislikofen",
    "lat": 47.5583,
    "long": 8.3639
  },
  {
    "zipCode": 5464,
    "city": "Rümikon AG",
    "lat": 47.5656,
    "long": 8.3754
  },
  {
    "zipCode": 5465,
    "city": "Mellikon",
    "lat": 47.5694,
    "long": 8.3542
  },
  {
    "zipCode": 5466,
    "city": "Kaiserstuhl AG",
    "lat": 47.5684,
    "long": 8.418
  },
  {
    "zipCode": 5467,
    "city": "Fisibach",
    "lat": 47.5639,
    "long": 8.4097
  },
  {
    "zipCode": 5502,
    "city": "Hunzenschwil",
    "lat": 47.3842,
    "long": 8.1229
  },
  {
    "zipCode": 5503,
    "city": "Schafisheim",
    "lat": 47.3753,
    "long": 8.1408
  },
  {
    "zipCode": 5504,
    "city": "Othmarsingen",
    "lat": 47.4015,
    "long": 8.2185
  },
  {
    "zipCode": 5505,
    "city": "Brunegg",
    "lat": 47.4212,
    "long": 8.2158
  },
  {
    "zipCode": 5506,
    "city": "Mägenwil",
    "lat": 47.4125,
    "long": 8.233
  },
  {
    "zipCode": 5507,
    "city": "Mellingen",
    "lat": 47.419,
    "long": 8.2733
  },
  {
    "zipCode": 5512,
    "city": "Wohlenschwil",
    "lat": 47.4137,
    "long": 8.2573
  },
  {
    "zipCode": 5522,
    "city": "Tägerig",
    "lat": 47.4056,
    "long": 8.2768
  },
  {
    "zipCode": 5524,
    "city": "Niederwil AG",
    "lat": 47.3897,
    "long": 8.2914
  },
  {
    "zipCode": 5524,
    "city": "Nesselnbach",
    "lat": 47.3897,
    "long": 8.2914
  },
  {
    "zipCode": 5525,
    "city": "Fischbach-Göslikon",
    "lat": 47.3691,
    "long": 8.3111
  },
  {
    "zipCode": 5600,
    "city": "Ammerswil AG",
    "lat": 47.3682,
    "long": 8.2074
  },
  {
    "zipCode": 5600,
    "city": "Lenzbourg",
    "lat": 47.3885,
    "long": 8.175
  },
  {
    "zipCode": 5603,
    "city": "Staufen",
    "lat": 47.3837,
    "long": 8.1661
  },
  {
    "zipCode": 5604,
    "city": "Hendschiken",
    "lat": 47.3865,
    "long": 8.2178
  },
  {
    "zipCode": 5605,
    "city": "Dottikon",
    "lat": 47.3844,
    "long": 8.2398
  },
  {
    "zipCode": 5606,
    "city": "Dintikon",
    "lat": 47.3652,
    "long": 8.2302
  },
  {
    "zipCode": 5607,
    "city": "Hägglingen",
    "lat": 47.3885,
    "long": 8.2532
  },
  {
    "zipCode": 5608,
    "city": "Stetten AG",
    "lat": 47.4017,
    "long": 8.3019
  },
  {
    "zipCode": 5610,
    "city": "Wohlen",
    "lat": 47.3524,
    "long": 8.2788
  },
  {
    "zipCode": 5611,
    "city": "Anglikon",
    "lat": 47.3664,
    "long": 8.2633
  },
  {
    "zipCode": 5612,
    "city": "Villmergen",
    "lat": 47.3492,
    "long": 8.2458
  },
  {
    "zipCode": 5613,
    "city": "Hilfikon",
    "lat": 47.3313,
    "long": 8.2424
  },
  {
    "zipCode": 5614,
    "city": "Sarmenstorf",
    "lat": 47.3102,
    "long": 8.2495
  },
  {
    "zipCode": 5615,
    "city": "Fahrwangen",
    "lat": 47.2948,
    "long": 8.2421
  },
  {
    "zipCode": 5616,
    "city": "Meisterschwanden",
    "lat": 47.2949,
    "long": 8.2287
  },
  {
    "zipCode": 5617,
    "city": "Tennwil",
    "lat": 47.3081,
    "long": 8.2227
  },
  {
    "zipCode": 5618,
    "city": "Bettwil",
    "lat": 47.2906,
    "long": 8.2679
  },
  {
    "zipCode": 5619,
    "city": "Büttikon AG",
    "lat": 47.3286,
    "long": 8.2695
  },
  {
    "zipCode": 5619,
    "city": "Uezwil",
    "lat": 47.3169,
    "long": 8.2716
  },
  {
    "zipCode": 5620,
    "city": "Bremgarten AG",
    "lat": 47.3511,
    "long": 8.3421
  },
  {
    "zipCode": 5621,
    "city": "Zufikon",
    "lat": 47.3447,
    "long": 8.3582
  },
  {
    "zipCode": 5622,
    "city": "Waltenschwil",
    "lat": 47.3349,
    "long": 8.3034
  },
  {
    "zipCode": 5623,
    "city": "Boswil",
    "lat": 47.3038,
    "long": 8.3088
  },
  {
    "zipCode": 5624,
    "city": "Waldhäusern AG",
    "lat": 47.3283,
    "long": 8.3162
  },
  {
    "zipCode": 5624,
    "city": "Bünzen",
    "lat": 47.3098,
    "long": 8.3238
  },
  {
    "zipCode": 5625,
    "city": "Kallern",
    "lat": 47.3016,
    "long": 8.2813
  },
  {
    "zipCode": 5626,
    "city": "Hermetschwil-Staffeln",
    "lat": 47.3303,
    "long": 8.3413
  },
  {
    "zipCode": 5627,
    "city": "Besenbüren",
    "lat": 47.3144,
    "long": 8.3459
  },
  {
    "zipCode": 5628,
    "city": "Aristau",
    "lat": 47.2869,
    "long": 8.3636
  },
  {
    "zipCode": 5630,
    "city": "Muri AG",
    "lat": 47.2743,
    "long": 8.3385
  },
  {
    "zipCode": 5632,
    "city": "Buttwil",
    "lat": 47.2683,
    "long": 8.3106
  },
  {
    "zipCode": 5634,
    "city": "Merenschwand",
    "lat": 47.2587,
    "long": 8.3753
  },
  {
    "zipCode": 5636,
    "city": "Benzenschwil",
    "lat": 47.248,
    "long": 8.3651
  },
  {
    "zipCode": 5637,
    "city": "Beinwil (Freiamt)",
    "lat": 47.2296,
    "long": 8.3392
  },
  {
    "zipCode": 5637,
    "city": "Geltwil",
    "lat": 47.249,
    "long": 8.326
  },
  {
    "zipCode": 5642,
    "city": "Mühlau",
    "lat": 47.2304,
    "long": 8.3896
  },
  {
    "zipCode": 5643,
    "city": "Sins",
    "lat": 47.1922,
    "long": 8.3958
  },
  {
    "zipCode": 5643,
    "city": "Alikon",
    "lat": 47.2005,
    "long": 8.3604
  },
  {
    "zipCode": 5643,
    "city": "Sins",
    "lat": 47.1922,
    "long": 8.3958
  },
  {
    "zipCode": 5643,
    "city": "Meienberg",
    "lat": 47.1978,
    "long": 8.3762
  },
  {
    "zipCode": 5644,
    "city": "Auw",
    "lat": 47.2108,
    "long": 8.3658
  },
  {
    "zipCode": 5645,
    "city": "Aettenschwil",
    "lat": 47.1836,
    "long": 8.3718
  },
  {
    "zipCode": 5645,
    "city": "Fenkrieden",
    "lat": 47.1609,
    "long": 8.3702
  },
  {
    "zipCode": 5646,
    "city": "Abtwil AG",
    "lat": 47.1733,
    "long": 8.3577
  },
  {
    "zipCode": 5647,
    "city": "Oberrüti",
    "lat": 47.1667,
    "long": 8.3944
  },
  {
    "zipCode": 5702,
    "city": "Niederlenz",
    "lat": 47.4008,
    "long": 8.1764
  },
  {
    "zipCode": 5703,
    "city": "Seon",
    "lat": 47.3449,
    "long": 8.1561
  },
  {
    "zipCode": 5704,
    "city": "Egliswil",
    "lat": 47.3495,
    "long": 8.188
  },
  {
    "zipCode": 5705,
    "city": "Hallwil",
    "lat": 47.3265,
    "long": 8.1779
  },
  {
    "zipCode": 5706,
    "city": "Boniswil",
    "lat": 47.3173,
    "long": 8.1896
  },
  {
    "zipCode": 5707,
    "city": "Seengen",
    "lat": 47.3285,
    "long": 8.2051
  },
  {
    "zipCode": 5708,
    "city": "Birrwil",
    "lat": 47.2886,
    "long": 8.2
  },
  {
    "zipCode": 5712,
    "city": "Beinwil am See",
    "lat": 47.2606,
    "long": 8.2051
  },
  {
    "zipCode": 5722,
    "city": "Gränichen",
    "lat": 47.3593,
    "long": 8.1024
  },
  {
    "zipCode": 5723,
    "city": "Teufenthal AG",
    "lat": 47.3286,
    "long": 8.1207
  },
  {
    "zipCode": 5724,
    "city": "Dürrenäsch",
    "lat": 47.3181,
    "long": 8.1585
  },
  {
    "zipCode": 5725,
    "city": "Leutwil",
    "lat": 47.3083,
    "long": 8.1741
  },
  {
    "zipCode": 5726,
    "city": "Unterkulm",
    "lat": 47.31,
    "long": 8.1137
  },
  {
    "zipCode": 5727,
    "city": "Oberkulm",
    "lat": 47.3078,
    "long": 8.1442
  },
  {
    "zipCode": 5728,
    "city": "Gontenschwil",
    "lat": 47.2717,
    "long": 8.144
  },
  {
    "zipCode": 5732,
    "city": "Zetzwil",
    "lat": 47.2882,
    "long": 8.1509
  },
  {
    "zipCode": 5733,
    "city": "Leimbach AG",
    "lat": 47.2749,
    "long": 8.1701
  },
  {
    "zipCode": 5734,
    "city": "Reinach AG",
    "lat": 47.2573,
    "long": 8.1809
  },
  {
    "zipCode": 5735,
    "city": "Pfeffikon LU",
    "lat": 47.2276,
    "long": 8.1481
  },
  {
    "zipCode": 5736,
    "city": "Burg AG",
    "lat": 47.2339,
    "long": 8.178
  },
  {
    "zipCode": 5737,
    "city": "Menziken",
    "lat": 47.2425,
    "long": 8.1905
  },
  {
    "zipCode": 5742,
    "city": "Kölliken",
    "lat": 47.3388,
    "long": 8.0264
  },
  {
    "zipCode": 5745,
    "city": "Safenwil",
    "lat": 47.3214,
    "long": 7.9812
  },
  {
    "zipCode": 5746,
    "city": "Walterswil SO",
    "lat": 47.3245,
    "long": 7.9559
  },
  {
    "zipCode": 6000,
    "city": "Lucerne",
    "lat": 47.0471,
    "long": 8.3252
  },
  {
    "zipCode": 6002,
    "city": "Luzern",
    "lat": 47.0471,
    "long": 8.3252
  },
  {
    "zipCode": 6003,
    "city": "Luzern",
    "lat": 47.0505,
    "long": 8.3064
  },
  {
    "zipCode": 6004,
    "city": "Luzern",
    "lat": 47.0505,
    "long": 8.3064
  },
  {
    "zipCode": 6005,
    "city": "Luzern",
    "lat": 47.0505,
    "long": 8.3064
  },
  {
    "zipCode": 6005,
    "city": "St. Niklausen LU",
    "lat": 47.0202,
    "long": 8.3407
  },
  {
    "zipCode": 6006,
    "city": "Luzern",
    "lat": 47.0505,
    "long": 8.3064
  },
  {
    "zipCode": 6007,
    "city": "Luzern",
    "lat": 47.0471,
    "long": 8.3252
  },
  {
    "zipCode": 6009,
    "city": "Luzern",
    "lat": 47.0208,
    "long": 8.2589
  },
  {
    "zipCode": 6010,
    "city": "Kriens",
    "lat": 47.0311,
    "long": 8.2855
  },
  {
    "zipCode": 6010,
    "city": "Kriens",
    "lat": 46.8523,
    "long": 8.2432
  },
  {
    "zipCode": 6011,
    "city": "Kriens",
    "lat": 47.0208,
    "long": 8.2589
  },
  {
    "zipCode": 6012,
    "city": "Obernau",
    "lat": 47.0333,
    "long": 8.2544
  },
  {
    "zipCode": 6013,
    "city": "Eigenthal",
    "lat": 47.0107,
    "long": 8.2126
  },
  {
    "zipCode": 6014,
    "city": "Luzern",
    "lat": 47.0505,
    "long": 8.3064
  },
  {
    "zipCode": 6015,
    "city": "Luzern",
    "lat": 47.0505,
    "long": 8.3064
  },
  {
    "zipCode": 6016,
    "city": "Hellbühl",
    "lat": 47.0708,
    "long": 8.1991
  },
  {
    "zipCode": 6017,
    "city": "Ruswil",
    "lat": 47.0843,
    "long": 8.1264
  },
  {
    "zipCode": 6018,
    "city": "Buttisholz",
    "lat": 47.1144,
    "long": 8.0943
  },
  {
    "zipCode": 6019,
    "city": "Sigigen",
    "lat": 47.0654,
    "long": 8.1342
  },
  {
    "zipCode": 6020,
    "city": "Emmenbrücke",
    "lat": 47.0728,
    "long": 8.289
  },
  {
    "zipCode": 6021,
    "city": "Emmenbrücke 1",
    "lat": 47.0866,
    "long": 8.2862
  },
  {
    "zipCode": 6022,
    "city": "Grosswangen",
    "lat": 47.1328,
    "long": 8.0478
  },
  {
    "zipCode": 6023,
    "city": "Rothenburg",
    "lat": 47.0957,
    "long": 8.2723
  },
  {
    "zipCode": 6024,
    "city": "Hildisrieden",
    "lat": 47.1507,
    "long": 8.2258
  },
  {
    "zipCode": 6025,
    "city": "Neudorf",
    "lat": 47.177,
    "long": 8.2091
  },
  {
    "zipCode": 6026,
    "city": "Rain",
    "lat": 47.1297,
    "long": 8.2579
  },
  {
    "zipCode": 6027,
    "city": "Römerswil LU",
    "lat": 47.1681,
    "long": 8.2464
  },
  {
    "zipCode": 6028,
    "city": "Herlisberg",
    "lat": 47.1994,
    "long": 8.2312
  },
  {
    "zipCode": 6030,
    "city": "Ebikon",
    "lat": 47.0794,
    "long": 8.3404
  },
  {
    "zipCode": 6031,
    "city": "Ebikon",
    "lat": 47.0783,
    "long": 8.3315
  },
  {
    "zipCode": 6032,
    "city": "Emmen",
    "lat": 47.0861,
    "long": 8.3005
  },
  {
    "zipCode": 6033,
    "city": "Buchrain",
    "lat": 47.0962,
    "long": 8.3473
  },
  {
    "zipCode": 6034,
    "city": "Inwil",
    "lat": 47.1253,
    "long": 8.3488
  },
  {
    "zipCode": 6035,
    "city": "Perlen",
    "lat": 47.1094,
    "long": 8.362
  },
  {
    "zipCode": 6036,
    "city": "Dierikon",
    "lat": 47.0968,
    "long": 8.3695
  },
  {
    "zipCode": 6037,
    "city": "Root",
    "lat": 47.1146,
    "long": 8.3902
  },
  {
    "zipCode": 6038,
    "city": "Gisikon",
    "lat": 47.1255,
    "long": 8.4036
  },
  {
    "zipCode": 6038,
    "city": "Honau",
    "lat": 47.1325,
    "long": 8.4081
  },
  {
    "zipCode": 6039,
    "city": "Root D4",
    "lat": 47.1073,
    "long": 8.3634
  },
  {
    "zipCode": 6042,
    "city": "Dietwil",
    "lat": 47.1466,
    "long": 8.3936
  },
  {
    "zipCode": 6043,
    "city": "Adligenswil",
    "lat": 47.0652,
    "long": 8.3612
  },
  {
    "zipCode": 6044,
    "city": "Udligenswil",
    "lat": 47.09,
    "long": 8.4034
  },
  {
    "zipCode": 6045,
    "city": "Meggen",
    "lat": 47.0469,
    "long": 8.3747
  },
  {
    "zipCode": 6047,
    "city": "Kastanienbaum",
    "lat": 47.0082,
    "long": 8.34
  },
  {
    "zipCode": 6048,
    "city": "Horw",
    "lat": 47.0169,
    "long": 8.3096
  },
  {
    "zipCode": 6052,
    "city": "Hergiswil NW",
    "lat": 46.9843,
    "long": 8.3094
  },
  {
    "zipCode": 6053,
    "city": "Alpnachstad",
    "lat": 46.9544,
    "long": 8.2764
  },
  {
    "zipCode": 6055,
    "city": "Alpnach Dorf",
    "lat": 46.9404,
    "long": 8.2772
  },
  {
    "zipCode": 6056,
    "city": "Kägiswil",
    "lat": 46.9208,
    "long": 8.2621
  },
  {
    "zipCode": 6060,
    "city": "Ramersberg",
    "lat": 46.8993,
    "long": 8.2335
  },
  {
    "zipCode": 6060,
    "city": "Sarnen",
    "lat": 46.8961,
    "long": 8.2453
  },
  {
    "zipCode": 6061,
    "city": "Sarnen 1",
    "lat": 46.8985,
    "long": 8.1765
  },
  {
    "zipCode": 6062,
    "city": "Wilen (Sarnen)",
    "lat": 46.8799,
    "long": 8.2225
  },
  {
    "zipCode": 6063,
    "city": "Stalden (Sarnen)",
    "lat": 46.8871,
    "long": 8.2125
  },
  {
    "zipCode": 6064,
    "city": "Kerns",
    "lat": 46.9012,
    "long": 8.2751
  },
  {
    "zipCode": 6066,
    "city": "St. Niklausen OW",
    "lat": 46.8756,
    "long": 8.2818
  },
  {
    "zipCode": 6067,
    "city": "Melchtal",
    "lat": 46.8344,
    "long": 8.2899
  },
  {
    "zipCode": 6068,
    "city": "Melchsee-Frutt",
    "lat": 46.7746,
    "long": 8.2685
  },
  {
    "zipCode": 6072,
    "city": "Sachseln",
    "lat": 46.8672,
    "long": 8.2334
  },
  {
    "zipCode": 6073,
    "city": "Flüeli-Ranft",
    "lat": 46.871,
    "long": 8.2673
  },
  {
    "zipCode": 6074,
    "city": "Giswil",
    "lat": 46.8333,
    "long": 8.1806
  },
  {
    "zipCode": 6078,
    "city": "Bürglen OW",
    "lat": 46.8103,
    "long": 8.1626
  },
  {
    "zipCode": 6078,
    "city": "Lungern",
    "lat": 46.7858,
    "long": 8.1598
  },
  {
    "zipCode": 6083,
    "city": "Hasliberg Hohfluh",
    "lat": 46.7526,
    "long": 8.1705
  },
  {
    "zipCode": 6084,
    "city": "Hasliberg Wasserwendi",
    "lat": 46.7471,
    "long": 8.1994
  },
  {
    "zipCode": 6085,
    "city": "Hasliberg Goldern",
    "lat": 46.7408,
    "long": 8.2001
  },
  {
    "zipCode": 6086,
    "city": "Hasliberg Reuti",
    "lat": 46.7319,
    "long": 8.2107
  },
  {
    "zipCode": 6102,
    "city": "Malters",
    "lat": 47.0363,
    "long": 8.1819
  },
  {
    "zipCode": 6103,
    "city": "Schwarzenberg LU",
    "lat": 47.0171,
    "long": 8.1726
  },
  {
    "zipCode": 6105,
    "city": "Schachen LU",
    "lat": 47.0375,
    "long": 8.1395
  },
  {
    "zipCode": 6106,
    "city": "Werthenstein",
    "lat": 47.0558,
    "long": 8.1018
  },
  {
    "zipCode": 6110,
    "city": "Wolhusen",
    "lat": 47.0598,
    "long": 8.0739
  },
  {
    "zipCode": 6110,
    "city": "Fontannen b. Wolhusen",
    "lat": 47.0532,
    "long": 8.0566
  },
  {
    "zipCode": 6112,
    "city": "Doppleschwand",
    "lat": 47.0183,
    "long": 8.055
  },
  {
    "zipCode": 6113,
    "city": "Romoos",
    "lat": 47.0109,
    "long": 8.0254
  },
  {
    "zipCode": 6114,
    "city": "Steinhuserberg",
    "lat": 47.0418,
    "long": 8.0498
  },
  {
    "zipCode": 6122,
    "city": "Menznau",
    "lat": 47.0836,
    "long": 8.0397
  },
  {
    "zipCode": 6123,
    "city": "Geiss",
    "lat": 47.092,
    "long": 8.0569
  },
  {
    "zipCode": 6125,
    "city": "Menzberg",
    "lat": 47.041,
    "long": 7.998
  },
  {
    "zipCode": 6126,
    "city": "Daiwil",
    "lat": 47.0984,
    "long": 8.0139
  },
  {
    "zipCode": 6130,
    "city": "Willisau",
    "lat": 47.1218,
    "long": 7.9942
  },
  {
    "zipCode": 6132,
    "city": "Rohrmatt",
    "lat": 47.0829,
    "long": 7.9851
  },
  {
    "zipCode": 6133,
    "city": "Hergiswil b. Willisau",
    "lat": 47.085,
    "long": 7.958
  },
  {
    "zipCode": 6142,
    "city": "Gettnau",
    "lat": 47.1406,
    "long": 7.9701
  },
  {
    "zipCode": 6143,
    "city": "Ohmstal",
    "lat": 47.1623,
    "long": 7.9527
  },
  {
    "zipCode": 6144,
    "city": "Zell LU",
    "lat": 47.1367,
    "long": 7.9249
  },
  {
    "zipCode": 6145,
    "city": "Fischbach LU",
    "lat": 47.1545,
    "long": 7.905
  },
  {
    "zipCode": 6146,
    "city": "Grossdietwil",
    "lat": 47.1684,
    "long": 7.8914
  },
  {
    "zipCode": 6147,
    "city": "Altbüron",
    "lat": 47.1812,
    "long": 7.8847
  },
  {
    "zipCode": 6152,
    "city": "Hüswil",
    "lat": 47.1287,
    "long": 7.907
  },
  {
    "zipCode": 6153,
    "city": "Ufhusen",
    "lat": 47.117,
    "long": 7.8961
  },
  {
    "zipCode": 6154,
    "city": "Hofstatt",
    "lat": 47.086,
    "long": 7.9161
  },
  {
    "zipCode": 6156,
    "city": "Luthern",
    "lat": 47.0575,
    "long": 7.9169
  },
  {
    "zipCode": 6156,
    "city": "Luthern Bad",
    "lat": 47.0575,
    "long": 7.9169
  },
  {
    "zipCode": 6160,
    "city": "Entlebuch",
    "lat": 46.9762,
    "long": 8.1079
  },
  {
    "zipCode": 6162,
    "city": "Entlebuch",
    "lat": 46.9956,
    "long": 8.0635
  },
  {
    "zipCode": 6162,
    "city": "Finsterwald b. Entlebuch",
    "lat": 46.9998,
    "long": 8.0772
  },
  {
    "zipCode": 6162,
    "city": "Rengg",
    "lat": 47.0041,
    "long": 8.0908
  },
  {
    "zipCode": 6163,
    "city": "Ebnet",
    "lat": 47.0231,
    "long": 8.0782
  },
  {
    "zipCode": 6166,
    "city": "Hasle LU",
    "lat": 46.9779,
    "long": 8.0533
  },
  {
    "zipCode": 6167,
    "city": "Bramboden",
    "lat": 46.9793,
    "long": 7.9851
  },
  {
    "zipCode": 6170,
    "city": "Schüpfheim",
    "lat": 46.9516,
    "long": 8.0172
  },
  {
    "zipCode": 6173,
    "city": "Flühli LU",
    "lat": 46.8839,
    "long": 8.0156
  },
  {
    "zipCode": 6174,
    "city": "Sörenberg",
    "lat": 46.8222,
    "long": 8.0374
  },
  {
    "zipCode": 6182,
    "city": "Escholzmatt",
    "lat": 46.9135,
    "long": 7.9343
  },
  {
    "zipCode": 6192,
    "city": "Wiggen",
    "lat": 46.8963,
    "long": 7.9088
  },
  {
    "zipCode": 6196,
    "city": "Marbach LU",
    "lat": 46.8544,
    "long": 7.8997
  },
  {
    "zipCode": 6197,
    "city": "Schangnau",
    "lat": 46.8278,
    "long": 7.8599
  },
  {
    "zipCode": 6203,
    "city": "Sempach Station",
    "lat": 47.1169,
    "long": 8.1947
  },
  {
    "zipCode": 6204,
    "city": "Sempach",
    "lat": 47.1358,
    "long": 8.1915
  },
  {
    "zipCode": 6205,
    "city": "Eich",
    "lat": 47.1512,
    "long": 8.167
  },
  {
    "zipCode": 6206,
    "city": "Neuenkirch",
    "lat": 47.0999,
    "long": 8.2042
  },
  {
    "zipCode": 6207,
    "city": "Nottwil",
    "lat": 47.1357,
    "long": 8.1371
  },
  {
    "zipCode": 6208,
    "city": "Oberkirch LU",
    "lat": 47.1564,
    "long": 8.1157
  },
  {
    "zipCode": 6210,
    "city": "Sursee",
    "lat": 47.1709,
    "long": 8.1111
  },
  {
    "zipCode": 6211,
    "city": "Buchs LU",
    "lat": 47.2006,
    "long": 8.0308
  },
  {
    "zipCode": 6212,
    "city": "Kaltbach",
    "lat": 47.184,
    "long": 8.0623
  },
  {
    "zipCode": 6212,
    "city": "St. Erhard",
    "lat": 47.1843,
    "long": 8.0751
  },
  {
    "zipCode": 6213,
    "city": "Knutwil",
    "lat": 47.1995,
    "long": 8.0732
  },
  {
    "zipCode": 6214,
    "city": "Schenkon",
    "lat": 47.1683,
    "long": 8.1438
  },
  {
    "zipCode": 6215,
    "city": "Schwarzenbach LU",
    "lat": 47.2333,
    "long": 8.2126
  },
  {
    "zipCode": 6215,
    "city": "Beromünster",
    "lat": 47.2061,
    "long": 8.1926
  },
  {
    "zipCode": 6216,
    "city": "Mauensee",
    "lat": 47.1685,
    "long": 8.0662
  },
  {
    "zipCode": 6217,
    "city": "Kottwil",
    "lat": 47.1645,
    "long": 8.0464
  },
  {
    "zipCode": 6218,
    "city": "Ettiswil",
    "lat": 47.1503,
    "long": 8.0176
  },
  {
    "zipCode": 6221,
    "city": "Rickenbach LU",
    "lat": 47.2174,
    "long": 8.1549
  },
  {
    "zipCode": 6222,
    "city": "Gunzwil",
    "lat": 47.2107,
    "long": 8.1793
  },
  {
    "zipCode": 6231,
    "city": "Schlierbach",
    "lat": 47.2235,
    "long": 8.111
  },
  {
    "zipCode": 6232,
    "city": "Geuensee",
    "lat": 47.1997,
    "long": 8.1069
  },
  {
    "zipCode": 6233,
    "city": "Büron",
    "lat": 47.2121,
    "long": 8.0942
  },
  {
    "zipCode": 6234,
    "city": "Triengen",
    "lat": 47.2337,
    "long": 8.0773
  },
  {
    "zipCode": 6234,
    "city": "Kulmerau",
    "lat": 47.2546,
    "long": 8.0892
  },
  {
    "zipCode": 6235,
    "city": "Winikon",
    "lat": 47.2386,
    "long": 8.0506
  },
  {
    "zipCode": 6236,
    "city": "Wilihof",
    "lat": 47.2276,
    "long": 8.0656
  },
  {
    "zipCode": 6242,
    "city": "Wauwil",
    "lat": 47.1846,
    "long": 8.021
  },
  {
    "zipCode": 6243,
    "city": "Egolzwil",
    "lat": 47.1843,
    "long": 8.0075
  },
  {
    "zipCode": 6244,
    "city": "Nebikon",
    "lat": 47.1926,
    "long": 7.9781
  },
  {
    "zipCode": 6245,
    "city": "Ebersecken",
    "lat": 47.1803,
    "long": 7.9389
  },
  {
    "zipCode": 6246,
    "city": "Altishofen",
    "lat": 47.1992,
    "long": 7.9696
  },
  {
    "zipCode": 6247,
    "city": "Schötz",
    "lat": 47.169,
    "long": 7.9887
  },
  {
    "zipCode": 6248,
    "city": "Alberswil",
    "lat": 47.15,
    "long": 8.0031
  },
  {
    "zipCode": 6252,
    "city": "Dagmersellen",
    "lat": 47.2137,
    "long": 7.9847
  },
  {
    "zipCode": 6253,
    "city": "Uffikon",
    "lat": 47.211,
    "long": 8.0181
  },
  {
    "zipCode": 6260,
    "city": "Mehlsecken",
    "lat": 47.2445,
    "long": 7.9572
  },
  {
    "zipCode": 6260,
    "city": "Reiden",
    "lat": 47.2472,
    "long": 7.9714
  },
  {
    "zipCode": 6260,
    "city": "Reidermoos",
    "lat": 47.2535,
    "long": 7.9914
  },
  {
    "zipCode": 6260,
    "city": "Hintermoos",
    "lat": 47.2701,
    "long": 8.0039
  },
  {
    "zipCode": 6262,
    "city": "Langnau b. Reiden",
    "lat": 47.23,
    "long": 7.9631
  },
  {
    "zipCode": 6263,
    "city": "Richenthal",
    "lat": 47.2176,
    "long": 7.9446
  },
  {
    "zipCode": 6264,
    "city": "Pfaffnau",
    "lat": 47.2277,
    "long": 7.8972
  },
  {
    "zipCode": 6265,
    "city": "Roggliswil",
    "lat": 47.2135,
    "long": 7.8837
  },
  {
    "zipCode": 6274,
    "city": "Eschenbach LU",
    "lat": 47.1323,
    "long": 8.3196
  },
  {
    "zipCode": 6275,
    "city": "Ballwil",
    "lat": 47.1549,
    "long": 8.3214
  },
  {
    "zipCode": 6276,
    "city": "Hohenrain",
    "lat": 47.1808,
    "long": 8.318
  },
  {
    "zipCode": 6277,
    "city": "Lieli LU",
    "lat": 47.2077,
    "long": 8.2971
  },
  {
    "zipCode": 6277,
    "city": "Kleinwangen",
    "lat": 47.2077,
    "long": 8.2971
  },
  {
    "zipCode": 6280,
    "city": "Urswil",
    "lat": 47.1523,
    "long": 8.2949
  },
  {
    "zipCode": 6280,
    "city": "Hochdorf",
    "lat": 47.1684,
    "long": 8.2918
  },
  {
    "zipCode": 6281,
    "city": "Hochdorf",
    "lat": 47.1664,
    "long": 8.2923
  },
  {
    "zipCode": 6283,
    "city": "Baldegg",
    "lat": 47.1833,
    "long": 8.2808
  },
  {
    "zipCode": 6284,
    "city": "Gelfingen",
    "lat": 47.2145,
    "long": 8.2654
  },
  {
    "zipCode": 6284,
    "city": "Sulz LU",
    "lat": 47.22,
    "long": 8.2857
  },
  {
    "zipCode": 6285,
    "city": "Retschwil",
    "lat": 47.1929,
    "long": 8.2539
  },
  {
    "zipCode": 6285,
    "city": "Hitzkirch",
    "lat": 47.224,
    "long": 8.2643
  },
  {
    "zipCode": 6286,
    "city": "Altwis",
    "lat": 47.2385,
    "long": 8.2478
  },
  {
    "zipCode": 6287,
    "city": "Aesch LU",
    "lat": 47.2564,
    "long": 8.2409
  },
  {
    "zipCode": 6288,
    "city": "Schongau",
    "lat": 47.2685,
    "long": 8.2651
  },
  {
    "zipCode": 6289,
    "city": "Hämikon",
    "lat": 47.2384,
    "long": 8.2764
  },
  {
    "zipCode": 6289,
    "city": "Müswangen",
    "lat": 47.2383,
    "long": 8.2891
  },
  {
    "zipCode": 6289,
    "city": "Hämikon",
    "lat": 47.2384,
    "long": 8.2764
  },
  {
    "zipCode": 6294,
    "city": "Ermensee",
    "lat": 47.2278,
    "long": 8.2363
  },
  {
    "zipCode": 6295,
    "city": "Mosen",
    "lat": 47.2449,
    "long": 8.2263
  },
  {
    "zipCode": 6300,
    "city": "Zoug",
    "lat": 47.1724,
    "long": 8.5174
  },
  {
    "zipCode": 6301,
    "city": "Zug",
    "lat": 47.15,
    "long": 8.5232
  },
  {
    "zipCode": 6302,
    "city": "Zug",
    "lat": 47.15,
    "long": 8.5232
  },
  {
    "zipCode": 6303,
    "city": "Zug",
    "lat": 47.15,
    "long": 8.5232
  },
  {
    "zipCode": 6310,
    "city": "Zug",
    "lat": 47.15,
    "long": 8.5232
  },
  {
    "zipCode": 6312,
    "city": "Steinhausen",
    "lat": 47.1951,
    "long": 8.4858
  },
  {
    "zipCode": 6313,
    "city": "Menzingen",
    "lat": 47.1776,
    "long": 8.5922
  },
  {
    "zipCode": 6313,
    "city": "Finstersee",
    "lat": 47.1685,
    "long": 8.6308
  },
  {
    "zipCode": 6313,
    "city": "Edlibach",
    "lat": 47.1826,
    "long": 8.575
  },
  {
    "zipCode": 6314,
    "city": "Neuägeri",
    "lat": 47.1538,
    "long": 8.5642
  },
  {
    "zipCode": 6314,
    "city": "Unterägeri",
    "lat": 47.1364,
    "long": 8.5853
  },
  {
    "zipCode": 6315,
    "city": "Oberägeri",
    "lat": 47.1361,
    "long": 8.6144
  },
  {
    "zipCode": 6315,
    "city": "Alosen",
    "lat": 47.1423,
    "long": 8.6386
  },
  {
    "zipCode": 6315,
    "city": "Morgarten",
    "lat": 47.1026,
    "long": 8.6398
  },
  {
    "zipCode": 6317,
    "city": "Oberwil b. Zug",
    "lat": 47.1483,
    "long": 8.5073
  },
  {
    "zipCode": 6318,
    "city": "Walchwil",
    "lat": 47.1017,
    "long": 8.5169
  },
  {
    "zipCode": 6319,
    "city": "Allenwinden",
    "lat": 47.1642,
    "long": 8.5554
  },
  {
    "zipCode": 6330,
    "city": "Cham",
    "lat": 47.1821,
    "long": 8.4636
  },
  {
    "zipCode": 6331,
    "city": "Hünenberg",
    "lat": 47.1754,
    "long": 8.425
  },
  {
    "zipCode": 6332,
    "city": "Hagendorn",
    "lat": 47.2045,
    "long": 8.4333
  },
  {
    "zipCode": 6333,
    "city": "Hünenberg See",
    "lat": 47.1743,
    "long": 8.4512
  },
  {
    "zipCode": 6340,
    "city": "Sihlbrugg",
    "lat": 47.2157,
    "long": 8.5735
  },
  {
    "zipCode": 6340,
    "city": "Baar",
    "lat": 47.1963,
    "long": 8.5295
  },
  {
    "zipCode": 6341,
    "city": "Baar",
    "lat": 47.1954,
    "long": 8.537
  },
  {
    "zipCode": 6343,
    "city": "Buonas",
    "lat": 47.1415,
    "long": 8.4535
  },
  {
    "zipCode": 6343,
    "city": "Risch",
    "lat": 47.1335,
    "long": 8.4651
  },
  {
    "zipCode": 6343,
    "city": "Rotkreuz",
    "lat": 47.1406,
    "long": 8.4293
  },
  {
    "zipCode": 6343,
    "city": "Holzhäusern ZG",
    "lat": 47.1565,
    "long": 8.4409
  },
  {
    "zipCode": 6344,
    "city": "Meierskappel",
    "lat": 47.1242,
    "long": 8.4444
  },
  {
    "zipCode": 6345,
    "city": "Neuheim",
    "lat": 47.2019,
    "long": 8.5805
  },
  {
    "zipCode": 6349,
    "city": "Baar",
    "lat": 47.1954,
    "long": 8.537
  },
  {
    "zipCode": 6353,
    "city": "Weggis",
    "lat": 47.0321,
    "long": 8.4322
  },
  {
    "zipCode": 6354,
    "city": "Vitznau",
    "lat": 47.0101,
    "long": 8.4842
  },
  {
    "zipCode": 6356,
    "city": "Rigi Kaltbad",
    "lat": 47.0442,
    "long": 8.4652
  },
  {
    "zipCode": 6362,
    "city": "Stansstad",
    "lat": 46.9768,
    "long": 8.3355
  },
  {
    "zipCode": 6363,
    "city": "Obbürgen",
    "lat": 46.9831,
    "long": 8.3631
  },
  {
    "zipCode": 6363,
    "city": "Bürgenstock",
    "lat": 46.9946,
    "long": 8.4283
  },
  {
    "zipCode": 6363,
    "city": "Fürigen",
    "lat": 46.9831,
    "long": 8.3631
  },
  {
    "zipCode": 6365,
    "city": "Kehrsiten",
    "lat": 47.0003,
    "long": 8.3673
  },
  {
    "zipCode": 6370,
    "city": "Stans",
    "lat": 46.9581,
    "long": 8.3661
  },
  {
    "zipCode": 6370,
    "city": "Oberdorf NW",
    "lat": 46.9424,
    "long": 8.4059
  },
  {
    "zipCode": 6371,
    "city": "Stans",
    "lat": 46.9589,
    "long": 8.3633
  },
  {
    "zipCode": 6372,
    "city": "Ennetmoos",
    "lat": 46.9559,
    "long": 8.3388
  },
  {
    "zipCode": 6373,
    "city": "Ennetbürgen",
    "lat": 46.9842,
    "long": 8.41
  },
  {
    "zipCode": 6374,
    "city": "Buochs",
    "lat": 46.974,
    "long": 8.4228
  },
  {
    "zipCode": 6375,
    "city": "Beckenried",
    "lat": 46.9665,
    "long": 8.4757
  },
  {
    "zipCode": 6376,
    "city": "Emmetten",
    "lat": 46.9566,
    "long": 8.5147
  },
  {
    "zipCode": 6377,
    "city": "Seelisberg",
    "lat": 46.973,
    "long": 8.5869
  },
  {
    "zipCode": 6382,
    "city": "Büren NW",
    "lat": 46.9408,
    "long": 8.3976
  },
  {
    "zipCode": 6383,
    "city": "Wirzweli",
    "lat": 46.9149,
    "long": 8.3645
  },
  {
    "zipCode": 6383,
    "city": "Wiesenberg",
    "lat": 46.9271,
    "long": 8.3652
  },
  {
    "zipCode": 6383,
    "city": "Dallenwil",
    "lat": 46.9242,
    "long": 8.3879
  },
  {
    "zipCode": 6383,
    "city": "Niederrickenbach",
    "lat": 46.9273,
    "long": 8.4271
  },
  {
    "zipCode": 6386,
    "city": "Wolfenschiessen",
    "lat": 46.9032,
    "long": 8.3942
  },
  {
    "zipCode": 6387,
    "city": "Oberrickenbach",
    "lat": 46.8877,
    "long": 8.4173
  },
  {
    "zipCode": 6388,
    "city": "Grafenort",
    "lat": 46.8702,
    "long": 8.3744
  },
  {
    "zipCode": 6390,
    "city": "Engelberg",
    "lat": 46.8211,
    "long": 8.4013
  },
  {
    "zipCode": 6391,
    "city": "Engelberg",
    "lat": 46.8197,
    "long": 8.4341
  },
  {
    "zipCode": 6402,
    "city": "Merlischachen",
    "lat": 47.0662,
    "long": 8.4054
  },
  {
    "zipCode": 6403,
    "city": "Küssnacht am Rigi",
    "lat": 47.0856,
    "long": 8.4421
  },
  {
    "zipCode": 6404,
    "city": "Greppen",
    "lat": 47.0551,
    "long": 8.4303
  },
  {
    "zipCode": 6405,
    "city": "Immensee",
    "lat": 47.0965,
    "long": 8.4636
  },
  {
    "zipCode": 6410,
    "city": "Rigi Scheidegg",
    "lat": 47.0268,
    "long": 8.5228
  },
  {
    "zipCode": 6410,
    "city": "Rigi Staffel",
    "lat": 47.0523,
    "long": 8.4752
  },
  {
    "zipCode": 6410,
    "city": "Rigi Kulm",
    "lat": 47.0555,
    "long": 8.4845
  },
  {
    "zipCode": 6410,
    "city": "Rigi Klösterli",
    "lat": 47.0445,
    "long": 8.4869
  },
  {
    "zipCode": 6410,
    "city": "Goldau",
    "lat": 47.0476,
    "long": 8.5462
  },
  {
    "zipCode": 6414,
    "city": "Oberarth",
    "lat": 47.055,
    "long": 8.5359
  },
  {
    "zipCode": 6415,
    "city": "Arth",
    "lat": 47.0634,
    "long": 8.5235
  },
  {
    "zipCode": 6416,
    "city": "Steinerberg",
    "lat": 47.0521,
    "long": 8.584
  },
  {
    "zipCode": 6417,
    "city": "Sattel",
    "lat": 47.0825,
    "long": 8.6356
  },
  {
    "zipCode": 6418,
    "city": "Rothenthurm",
    "lat": 47.1042,
    "long": 8.6759
  },
  {
    "zipCode": 6422,
    "city": "Steinen",
    "lat": 47.0498,
    "long": 8.6121
  },
  {
    "zipCode": 6423,
    "city": "Seewen SZ",
    "lat": 47.0288,
    "long": 8.6304
  },
  {
    "zipCode": 6424,
    "city": "Lauerz",
    "lat": 47.0333,
    "long": 8.5834
  },
  {
    "zipCode": 6430,
    "city": "Schwyz",
    "lat": 47.0208,
    "long": 8.6541
  },
  {
    "zipCode": 6431,
    "city": "Schwyz",
    "lat": 47.0235,
    "long": 8.6746
  },
  {
    "zipCode": 6432,
    "city": "Rickenbach b. Schwyz",
    "lat": 47.0235,
    "long": 8.6746
  },
  {
    "zipCode": 6433,
    "city": "Stoos SZ",
    "lat": 46.9767,
    "long": 8.6632
  },
  {
    "zipCode": 6434,
    "city": "Illgau",
    "lat": 46.9876,
    "long": 8.7251
  },
  {
    "zipCode": 6436,
    "city": "Muotathal",
    "lat": 46.9768,
    "long": 8.765
  },
  {
    "zipCode": 6436,
    "city": "Bisisthal",
    "lat": 46.9434,
    "long": 8.8318
  },
  {
    "zipCode": 6436,
    "city": "Ried (Muotathal)",
    "lat": 46.9883,
    "long": 8.7128
  },
  {
    "zipCode": 6438,
    "city": "Ibach",
    "lat": 47.011,
    "long": 8.6454
  },
  {
    "zipCode": 6440,
    "city": "Brunnen",
    "lat": 46.9936,
    "long": 8.6054
  },
  {
    "zipCode": 6441,
    "city": "Rütli",
    "lat": 46.9685,
    "long": 8.5927
  },
  {
    "zipCode": 6442,
    "city": "Gersau",
    "lat": 46.9942,
    "long": 8.525
  },
  {
    "zipCode": 6443,
    "city": "Morschach",
    "lat": 46.9827,
    "long": 8.6183
  },
  {
    "zipCode": 6452,
    "city": "Riemenstalden",
    "lat": 46.9471,
    "long": 8.6653
  },
  {
    "zipCode": 6452,
    "city": "Sisikon",
    "lat": 46.9491,
    "long": 8.62
  },
  {
    "zipCode": 6454,
    "city": "Flüelen",
    "lat": 46.9048,
    "long": 8.624
  },
  {
    "zipCode": 6460,
    "city": "Altdorf",
    "lat": 46.8804,
    "long": 8.6444
  },
  {
    "zipCode": 6461,
    "city": "Isenthal",
    "lat": 46.9108,
    "long": 8.5612
  },
  {
    "zipCode": 6462,
    "city": "Seedorf UR",
    "lat": 46.882,
    "long": 8.6161
  },
  {
    "zipCode": 6463,
    "city": "Bürglen UR",
    "lat": 46.8757,
    "long": 8.6654
  },
  {
    "zipCode": 6464,
    "city": "Spiringen",
    "lat": 46.8726,
    "long": 8.7302
  },
  {
    "zipCode": 6465,
    "city": "Unterschächen",
    "lat": 46.8628,
    "long": 8.7692
  },
  {
    "zipCode": 6466,
    "city": "Bauen",
    "lat": 46.9356,
    "long": 8.5784
  },
  {
    "zipCode": 6467,
    "city": "Schattdorf",
    "lat": 46.8655,
    "long": 8.6547
  },
  {
    "zipCode": 6468,
    "city": "Attinghausen",
    "lat": 46.8626,
    "long": 8.6304
  },
  {
    "zipCode": 6469,
    "city": "Haldi b. Schattdorf",
    "lat": 46.8636,
    "long": 8.6749
  },
  {
    "zipCode": 6472,
    "city": "Erstfeld",
    "lat": 46.8188,
    "long": 8.6505
  },
  {
    "zipCode": 6473,
    "city": "Silenen",
    "lat": 46.7891,
    "long": 8.6732
  },
  {
    "zipCode": 6474,
    "city": "Amsteg",
    "lat": 46.7713,
    "long": 8.6696
  },
  {
    "zipCode": 6475,
    "city": "Bristen",
    "lat": 46.7691,
    "long": 8.6903
  },
  {
    "zipCode": 6476,
    "city": "Intschi",
    "lat": 46.7604,
    "long": 8.649
  },
  {
    "zipCode": 6482,
    "city": "Gurtnellen",
    "lat": 46.7381,
    "long": 8.6284
  },
  {
    "zipCode": 6484,
    "city": "Wassen UR",
    "lat": 46.7065,
    "long": 8.5988
  },
  {
    "zipCode": 6485,
    "city": "Meien",
    "lat": 46.7238,
    "long": 8.5571
  },
  {
    "zipCode": 6487,
    "city": "Göschenen",
    "lat": 46.6682,
    "long": 8.5871
  },
  {
    "zipCode": 6490,
    "city": "Andermatt",
    "lat": 46.6356,
    "long": 8.5939
  },
  {
    "zipCode": 6491,
    "city": "Realp",
    "lat": 46.5982,
    "long": 8.5028
  },
  {
    "zipCode": 6493,
    "city": "Hospental",
    "lat": 46.6196,
    "long": 8.5698
  },
  {
    "zipCode": 6500,
    "city": "Bellinzone",
    "lat": 46.1928,
    "long": 9.017
  },
  {
    "zipCode": 6501,
    "city": "Bellinzona",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6503,
    "city": "Bellinzona",
    "lat": 46.1928,
    "long": 9.017
  },
  {
    "zipCode": 6512,
    "city": "Giubiasco",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6513,
    "city": "Monte Carasso",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6514,
    "city": "Sementina",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6515,
    "city": "Gudo",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6516,
    "city": "Cugnasco",
    "lat": 46.1747,
    "long": 8.9168
  },
  {
    "zipCode": 6517,
    "city": "Arbedo",
    "lat": 46.2146,
    "long": 9.0455
  },
  {
    "zipCode": 6518,
    "city": "Gorduno",
    "lat": 46.2163,
    "long": 9.0308
  },
  {
    "zipCode": 6523,
    "city": "Preonzo",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6524,
    "city": "Moleno",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6525,
    "city": "Gnosca",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6526,
    "city": "Prosito",
    "lat": 46.2806,
    "long": 8.9841
  },
  {
    "zipCode": 6527,
    "city": "Lodrino",
    "lat": 46.3002,
    "long": 8.9799
  },
  {
    "zipCode": 6528,
    "city": "Camorino",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6532,
    "city": "Castione",
    "lat": 46.2281,
    "long": 9.0433
  },
  {
    "zipCode": 6533,
    "city": "Lumino",
    "lat": 46.2302,
    "long": 9.0642
  },
  {
    "zipCode": 6534,
    "city": "S. Vittore",
    "lat": 46.2371,
    "long": 9.1068
  },
  {
    "zipCode": 6534,
    "city": "S. Vittore",
    "lat": 46.2371,
    "long": 9.1068
  },
  {
    "zipCode": 6535,
    "city": "Roveredo GR",
    "lat": 46.2365,
    "long": 9.1275
  },
  {
    "zipCode": 6537,
    "city": "Grono",
    "lat": 46.2483,
    "long": 9.1483
  },
  {
    "zipCode": 6538,
    "city": "Verdabbio",
    "lat": 46.2326,
    "long": 9.1815
  },
  {
    "zipCode": 6538,
    "city": "Verdabbio",
    "lat": 46.2326,
    "long": 9.1815
  },
  {
    "zipCode": 6540,
    "city": "Castaneda",
    "lat": 46.2581,
    "long": 9.1387
  },
  {
    "zipCode": 6541,
    "city": "Sta. Maria in Calanca",
    "lat": 46.2629,
    "long": 9.1448
  },
  {
    "zipCode": 6542,
    "city": "Buseno",
    "lat": 46.2738,
    "long": 9.1073
  },
  {
    "zipCode": 6543,
    "city": "Arvigo",
    "lat": 46.3021,
    "long": 9.113
  },
  {
    "zipCode": 6544,
    "city": "Braggio",
    "lat": 46.3028,
    "long": 9.1238
  },
  {
    "zipCode": 6545,
    "city": "Selma",
    "lat": 46.3204,
    "long": 9.12
  },
  {
    "zipCode": 6546,
    "city": "Cauco",
    "lat": 46.3354,
    "long": 9.1213
  },
  {
    "zipCode": 6547,
    "city": "Augio",
    "lat": 46.3658,
    "long": 9.1278
  },
  {
    "zipCode": 6548,
    "city": "Rossa",
    "lat": 46.3714,
    "long": 9.1236
  },
  {
    "zipCode": 6549,
    "city": "Laura",
    "lat": 46.2125,
    "long": 9.1047
  },
  {
    "zipCode": 6556,
    "city": "Leggia",
    "lat": 46.2326,
    "long": 9.1815
  },
  {
    "zipCode": 6557,
    "city": "Cama",
    "lat": 46.278,
    "long": 9.1722
  },
  {
    "zipCode": 6558,
    "city": "Lostallo",
    "lat": 46.313,
    "long": 9.1966
  },
  {
    "zipCode": 6562,
    "city": "Soazza",
    "lat": 46.3664,
    "long": 9.222
  },
  {
    "zipCode": 6563,
    "city": "Mesocco",
    "lat": 46.3939,
    "long": 9.2333
  },
  {
    "zipCode": 6565,
    "city": "S. Bernardino",
    "lat": 46.3801,
    "long": 9.2277
  },
  {
    "zipCode": 6571,
    "city": "Indemini",
    "lat": 46.0944,
    "long": 8.8257
  },
  {
    "zipCode": 6572,
    "city": "Quartino",
    "lat": 46.1515,
    "long": 8.8958
  },
  {
    "zipCode": 6573,
    "city": "Magadino",
    "lat": 46.1489,
    "long": 8.8561
  },
  {
    "zipCode": 6574,
    "city": "Vira (Gambarogno)",
    "lat": 46.1433,
    "long": 8.842
  },
  {
    "zipCode": 6575,
    "city": "S. Nazzaro",
    "lat": 46.1316,
    "long": 8.8026
  },
  {
    "zipCode": 6575,
    "city": "Vairano",
    "lat": 46.1322,
    "long": 8.8109
  },
  {
    "zipCode": 6576,
    "city": "Gerra (Gambarogno)",
    "lat": 46.1231,
    "long": 8.7903
  },
  {
    "zipCode": 6577,
    "city": "Ranzo",
    "lat": 46.1146,
    "long": 8.7737
  },
  {
    "zipCode": 6578,
    "city": "Caviano",
    "lat": 46.1071,
    "long": 8.766
  },
  {
    "zipCode": 6579,
    "city": "Piazzogna",
    "lat": 46.1356,
    "long": 8.8237
  },
  {
    "zipCode": 6582,
    "city": "Pianezzo",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6583,
    "city": "S. Antonio (Val Morobbia)",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6584,
    "city": "Carena",
    "lat": 46.1999,
    "long": 9.0225
  },
  {
    "zipCode": 6592,
    "city": "S. Antonino",
    "lat": 46.1524,
    "long": 8.9799
  },
  {
    "zipCode": 6593,
    "city": "Cadenazzo",
    "lat": 46.1517,
    "long": 8.9472
  },
  {
    "zipCode": 6594,
    "city": "Contone",
    "lat": 46.1509,
    "long": 8.9262
  },
  {
    "zipCode": 6595,
    "city": "Riazzino",
    "lat": 46.1747,
    "long": 8.9
  },
  {
    "zipCode": 6596,
    "city": "Gordola",
    "lat": 46.1826,
    "long": 8.8666
  },
  {
    "zipCode": 6597,
    "city": "Agarone",
    "lat": 46.1784,
    "long": 8.9063
  },
  {
    "zipCode": 6598,
    "city": "Tenero",
    "lat": 46.1814,
    "long": 8.851
  },
  {
    "zipCode": 6599,
    "city": "Robasacco",
    "lat": 46.1427,
    "long": 8.9428
  },
  {
    "zipCode": 6600,
    "city": "Locarno",
    "lat": 46.1709,
    "long": 8.7995
  },
  {
    "zipCode": 6601,
    "city": "Locarno",
    "lat": 46.1647,
    "long": 8.8861
  },
  {
    "zipCode": 6602,
    "city": "Muralto",
    "lat": 46.174,
    "long": 8.8036
  },
  {
    "zipCode": 6604,
    "city": "Locarno",
    "lat": 46.1647,
    "long": 8.8861
  },
  {
    "zipCode": 6605,
    "city": "Locarno",
    "lat": 46.1709,
    "long": 8.7995
  },
  {
    "zipCode": 6611,
    "city": "Crana",
    "lat": 46.204,
    "long": 8.6098
  },
  {
    "zipCode": 6611,
    "city": "Mosogno",
    "lat": 46.2035,
    "long": 8.5866
  },
  {
    "zipCode": 6611,
    "city": "Gresso",
    "lat": 46.2249,
    "long": 8.6163
  },
  {
    "zipCode": 6612,
    "city": "Ascona",
    "lat": 46.1545,
    "long": 8.7733
  },
  {
    "zipCode": 6613,
    "city": "Porto Ronco",
    "lat": 46.1404,
    "long": 8.7255
  },
  {
    "zipCode": 6614,
    "city": "Brissago",
    "lat": 46.1201,
    "long": 8.7118
  },
  {
    "zipCode": 6614,
    "city": "Isole di Brissago",
    "lat": 46.1201,
    "long": 8.7118
  },
  {
    "zipCode": 6616,
    "city": "Losone",
    "lat": 46.1687,
    "long": 8.7593
  },
  {
    "zipCode": 6618,
    "city": "Arcegno",
    "lat": 46.1615,
    "long": 8.7421
  },
  {
    "zipCode": 6622,
    "city": "Ronco sopra Ascona",
    "lat": 46.1462,
    "long": 8.7279
  },
  {
    "zipCode": 6631,
    "city": "Corippo",
    "lat": 46.2359,
    "long": 8.8407
  },
  {
    "zipCode": 6632,
    "city": "Vogorno",
    "lat": 46.2228,
    "long": 8.8583
  },
  {
    "zipCode": 6633,
    "city": "Lavertezzo",
    "lat": 46.2589,
    "long": 8.8376
  },
  {
    "zipCode": 6634,
    "city": "Brione (Verzasca)",
    "lat": 46.2953,
    "long": 8.7917
  },
  {
    "zipCode": 6635,
    "city": "Gerra (Verzasca)",
    "lat": 46.3171,
    "long": 8.8013
  },
  {
    "zipCode": 6636,
    "city": "Frasco",
    "lat": 46.344,
    "long": 8.7984
  },
  {
    "zipCode": 6637,
    "city": "Sonogno",
    "lat": 46.3504,
    "long": 8.7851
  },
  {
    "zipCode": 6644,
    "city": "Orselina",
    "lat": 46.1801,
    "long": 8.7998
  },
  {
    "zipCode": 6645,
    "city": "Brione sopra Minusio",
    "lat": 46.1842,
    "long": 8.8142
  },
  {
    "zipCode": 6646,
    "city": "Contra",
    "lat": 46.188,
    "long": 8.8407
  },
  {
    "zipCode": 6647,
    "city": "Mergoscia",
    "lat": 46.2106,
    "long": 8.8478
  },
  {
    "zipCode": 6648,
    "city": "Minusio",
    "lat": 46.1777,
    "long": 8.8147
  },
  {
    "zipCode": 6652,
    "city": "Tegna",
    "lat": 46.1869,
    "long": 8.7452
  },
  {
    "zipCode": 6653,
    "city": "Verscio",
    "lat": 46.1848,
    "long": 8.7322
  },
  {
    "zipCode": 6654,
    "city": "Cavigliano",
    "lat": 46.1855,
    "long": 8.7149
  },
  {
    "zipCode": 6655,
    "city": "Intragna",
    "lat": 46.1775,
    "long": 8.7002
  },
  {
    "zipCode": 6655,
    "city": "Verdasio",
    "lat": 46.1651,
    "long": 8.6365
  },
  {
    "zipCode": 6655,
    "city": "Rasa",
    "lat": 46.1572,
    "long": 8.6559
  },
  {
    "zipCode": 6656,
    "city": "Golino",
    "lat": 46.18,
    "long": 8.7127
  },
  {
    "zipCode": 6657,
    "city": "Palagnedra",
    "lat": 46.1546,
    "long": 8.6314
  },
  {
    "zipCode": 6658,
    "city": "Borgnone",
    "lat": 46.1597,
    "long": 8.6162
  },
  {
    "zipCode": 6659,
    "city": "Camedo",
    "lat": 46.1545,
    "long": 8.6104
  },
  {
    "zipCode": 6659,
    "city": "Moneto",
    "lat": 46.1504,
    "long": 8.6183
  },
  {
    "zipCode": 6661,
    "city": "Berzona",
    "lat": 46.2035,
    "long": 8.5866
  },
  {
    "zipCode": 6661,
    "city": "Auressio",
    "lat": 46.2035,
    "long": 8.5866
  },
  {
    "zipCode": 6661,
    "city": "Loco",
    "lat": 46.2035,
    "long": 8.5866
  },
  {
    "zipCode": 6662,
    "city": "Russo",
    "lat": 46.203,
    "long": 8.6233
  },
  {
    "zipCode": 6663,
    "city": "Spruga",
    "lat": 46.2009,
    "long": 8.5678
  },
  {
    "zipCode": 6663,
    "city": "Comologno",
    "lat": 46.2035,
    "long": 8.5745
  },
  {
    "zipCode": 6664,
    "city": "Vergeletto",
    "lat": 46.2035,
    "long": 8.5866
  },
  {
    "zipCode": 6670,
    "city": "Avegno",
    "lat": 46.2052,
    "long": 8.7455
  },
  {
    "zipCode": 6672,
    "city": "Gordevio",
    "lat": 46.226,
    "long": 8.7431
  },
  {
    "zipCode": 6673,
    "city": "Maggia",
    "lat": 46.2469,
    "long": 8.7062
  },
  {
    "zipCode": 6674,
    "city": "Riveo",
    "lat": 46.2977,
    "long": 8.6267
  },
  {
    "zipCode": 6674,
    "city": "Someo",
    "lat": 46.2872,
    "long": 8.6623
  },
  {
    "zipCode": 6675,
    "city": "Cevio",
    "lat": 46.3148,
    "long": 8.6033
  },
  {
    "zipCode": 6676,
    "city": "Bignasco",
    "lat": 46.3384,
    "long": 8.6082
  },
  {
    "zipCode": 6677,
    "city": "Moghegno",
    "lat": 46.2389,
    "long": 8.7072
  },
  {
    "zipCode": 6677,
    "city": "Aurigeno",
    "lat": 46.2301,
    "long": 8.7152
  },
  {
    "zipCode": 6678,
    "city": "Lodano",
    "lat": 46.2601,
    "long": 8.6843
  },
  {
    "zipCode": 6678,
    "city": "Coglio",
    "lat": 46.2705,
    "long": 8.685
  },
  {
    "zipCode": 6678,
    "city": "Giumaglio",
    "lat": 46.2741,
    "long": 8.6812
  },
  {
    "zipCode": 6682,
    "city": "Linescio",
    "lat": 46.3092,
    "long": 8.5822
  },
  {
    "zipCode": 6683,
    "city": "Niva (Vallemaggia)",
    "lat": 46.2922,
    "long": 8.5321
  },
  {
    "zipCode": 6683,
    "city": "Cerentino",
    "lat": 46.3082,
    "long": 8.5453
  },
  {
    "zipCode": 6684,
    "city": "Campo (Vallemaggia)",
    "lat": 46.2885,
    "long": 8.4958
  },
  {
    "zipCode": 6684,
    "city": "Cimalmotto",
    "lat": 46.2837,
    "long": 8.4886
  },
  {
    "zipCode": 6685,
    "city": "Bosco/Gurin",
    "lat": 46.317,
    "long": 8.4912
  },
  {
    "zipCode": 6690,
    "city": "Cavergno",
    "lat": 46.3453,
    "long": 8.6071
  },
  {
    "zipCode": 6690,
    "city": "S. Carlo (Val Bavona)",
    "lat": 46.3453,
    "long": 8.6071
  },
  {
    "zipCode": 6692,
    "city": "Menzonio",
    "lat": 46.3624,
    "long": 8.642
  },
  {
    "zipCode": 6692,
    "city": "Brontallo",
    "lat": 46.3545,
    "long": 8.6272
  },
  {
    "zipCode": 6693,
    "city": "Broglio",
    "lat": 46.3776,
    "long": 8.6609
  },
  {
    "zipCode": 6694,
    "city": "Prato-Sornico",
    "lat": 46.3963,
    "long": 8.6579
  },
  {
    "zipCode": 6695,
    "city": "Piano di Peccia",
    "lat": 46.4143,
    "long": 8.6081
  },
  {
    "zipCode": 6695,
    "city": "Peccia",
    "lat": 46.4084,
    "long": 8.6457
  },
  {
    "zipCode": 6696,
    "city": "Fusio",
    "lat": 46.4445,
    "long": 8.663
  },
  {
    "zipCode": 6702,
    "city": "Claro",
    "lat": 46.1904,
    "long": 9.0223
  },
  {
    "zipCode": 6703,
    "city": "Osogna",
    "lat": 46.3121,
    "long": 8.9858
  },
  {
    "zipCode": 6705,
    "city": "Cresciano",
    "lat": 46.2787,
    "long": 9.0026
  },
  {
    "zipCode": 6707,
    "city": "Iragna",
    "lat": 46.3257,
    "long": 8.9666
  },
  {
    "zipCode": 6710,
    "city": "Biasca",
    "lat": 46.3597,
    "long": 8.9697
  },
  {
    "zipCode": 6713,
    "city": "Malvaglia",
    "lat": 46.4059,
    "long": 8.9819
  },
  {
    "zipCode": 6714,
    "city": "Semione",
    "lat": 46.4001,
    "long": 8.9674
  },
  {
    "zipCode": 6715,
    "city": "Dongio",
    "lat": 46.4378,
    "long": 8.9553
  },
  {
    "zipCode": 6716,
    "city": "Acquarossa",
    "lat": 46.4547,
    "long": 8.9426
  },
  {
    "zipCode": 6716,
    "city": "Leontica",
    "lat": 46.4609,
    "long": 8.9233
  },
  {
    "zipCode": 6716,
    "city": "Lottigna",
    "lat": 46.4687,
    "long": 8.9431
  },
  {
    "zipCode": 6717,
    "city": "Dangio",
    "lat": 46.4955,
    "long": 8.9542
  },
  {
    "zipCode": 6717,
    "city": "Torre",
    "lat": 46.489,
    "long": 8.9533
  },
  {
    "zipCode": 6718,
    "city": "Olivone",
    "lat": 46.5296,
    "long": 8.9436
  },
  {
    "zipCode": 6718,
    "city": "Camperio",
    "lat": 46.5239,
    "long": 8.9077
  },
  {
    "zipCode": 6719,
    "city": "Aquila",
    "lat": 46.503,
    "long": 8.9482
  },
  {
    "zipCode": 6719,
    "city": "Aquila",
    "lat": 46.503,
    "long": 8.9482
  },
  {
    "zipCode": 6719,
    "city": "Aquila",
    "lat": 46.503,
    "long": 8.9482
  },
  {
    "zipCode": 6720,
    "city": "Campo (Blenio)",
    "lat": 46.5567,
    "long": 8.9364
  },
  {
    "zipCode": 6720,
    "city": "Ghirone",
    "lat": 46.5613,
    "long": 8.9441
  },
  {
    "zipCode": 6721,
    "city": "Ludiano",
    "lat": 46.42,
    "long": 8.971
  },
  {
    "zipCode": 6721,
    "city": "Motto (Blenio)",
    "lat": 46.4286,
    "long": 8.9716
  },
  {
    "zipCode": 6722,
    "city": "Corzoneso",
    "lat": 46.4476,
    "long": 8.9352
  },
  {
    "zipCode": 6723,
    "city": "Castro",
    "lat": 46.4718,
    "long": 8.9278
  },
  {
    "zipCode": 6723,
    "city": "Marolta",
    "lat": 46.4801,
    "long": 8.9225
  },
  {
    "zipCode": 6723,
    "city": "Prugiasco",
    "lat": 46.4616,
    "long": 8.9326
  },
  {
    "zipCode": 6724,
    "city": "Largario",
    "lat": 46.4945,
    "long": 8.941
  },
  {
    "zipCode": 6724,
    "city": "Ponto Valentino",
    "lat": 46.4821,
    "long": 8.9346
  },
  {
    "zipCode": 6742,
    "city": "Pollegio",
    "lat": 46.3649,
    "long": 8.9484
  },
  {
    "zipCode": 6743,
    "city": "Bodio TI",
    "lat": 46.3781,
    "long": 8.9099
  },
  {
    "zipCode": 6744,
    "city": "Personico",
    "lat": 46.372,
    "long": 8.9161
  },
  {
    "zipCode": 6745,
    "city": "Giornico",
    "lat": 46.4014,
    "long": 8.8737
  },
  {
    "zipCode": 6746,
    "city": "Nivo",
    "lat": 46.4372,
    "long": 8.843
  },
  {
    "zipCode": 6746,
    "city": "Lavorgo",
    "lat": 46.4426,
    "long": 8.8395
  },
  {
    "zipCode": 6746,
    "city": "Calonico",
    "lat": 46.4516,
    "long": 8.8424
  },
  {
    "zipCode": 6747,
    "city": "Chironico",
    "lat": 46.4226,
    "long": 8.8431
  },
  {
    "zipCode": 6748,
    "city": "Anzonico",
    "lat": 46.4324,
    "long": 8.8618
  },
  {
    "zipCode": 6749,
    "city": "Sobrio",
    "lat": 46.4511,
    "long": 8.8123
  },
  {
    "zipCode": 6749,
    "city": "Cavagnago",
    "lat": 46.4152,
    "long": 8.8815
  },
  {
    "zipCode": 6760,
    "city": "Carì",
    "lat": 46.4948,
    "long": 8.8209
  },
  {
    "zipCode": 6760,
    "city": "Campello",
    "lat": 46.4842,
    "long": 8.8165
  },
  {
    "zipCode": 6760,
    "city": "Calpiogna",
    "lat": 46.4863,
    "long": 8.8058
  },
  {
    "zipCode": 6760,
    "city": "Faido",
    "lat": 46.477,
    "long": 8.8013
  },
  {
    "zipCode": 6760,
    "city": "Rossura",
    "lat": 46.4753,
    "long": 8.8229
  },
  {
    "zipCode": 6760,
    "city": "Molare",
    "lat": 46.4874,
    "long": 8.8315
  },
  {
    "zipCode": 6763,
    "city": "Mairengo",
    "lat": 46.49,
    "long": 8.7886
  },
  {
    "zipCode": 6763,
    "city": "Osco",
    "lat": 46.4937,
    "long": 8.7819
  },
  {
    "zipCode": 6764,
    "city": "Chiggiogna",
    "lat": 46.467,
    "long": 8.8217
  },
  {
    "zipCode": 6764,
    "city": "Chiggiogna",
    "lat": 46.467,
    "long": 8.8217
  },
  {
    "zipCode": 6772,
    "city": "Rodi-Fiesso",
    "lat": 46.4891,
    "long": 8.7412
  },
  {
    "zipCode": 6773,
    "city": "Prato (Leventina)",
    "lat": 46.4824,
    "long": 8.757
  },
  {
    "zipCode": 6774,
    "city": "Dalpe",
    "lat": 46.4748,
    "long": 8.7746
  },
  {
    "zipCode": 6775,
    "city": "Ambrì",
    "lat": 46.5105,
    "long": 8.6966
  },
  {
    "zipCode": 6776,
    "city": "Piotta",
    "lat": 46.5146,
    "long": 8.6738
  },
  {
    "zipCode": 6777,
    "city": "Quinto",
    "lat": 46.5108,
    "long": 8.7111
  },
  {
    "zipCode": 6777,
    "city": "Varenzo",
    "lat": 46.5033,
    "long": 8.726
  },
  {
    "zipCode": 6780,
    "city": "Madrano",
    "lat": 46.5275,
    "long": 8.6293
  },
  {
    "zipCode": 6780,
    "city": "Airolo",
    "lat": 46.5286,
    "long": 8.6119
  },
  {
    "zipCode": 6781,
    "city": "Villa Bedretto",
    "lat": 46.5102,
    "long": 8.5246
  },
  {
    "zipCode": 6781,
    "city": "Bedretto",
    "lat": 46.506,
    "long": 8.5114
  },
  {
    "zipCode": 6802,
    "city": "Rivera",
    "lat": 46.1268,
    "long": 8.9232
  },
  {
    "zipCode": 6803,
    "city": "Camignolo",
    "lat": 46.1087,
    "long": 8.9365
  },
  {
    "zipCode": 6804,
    "city": "Bironico",
    "lat": 46.1137,
    "long": 8.9332
  },
  {
    "zipCode": 6805,
    "city": "Mezzovico",
    "lat": 46.0898,
    "long": 8.9176
  },
  {
    "zipCode": 6805,
    "city": "Mezzovico",
    "lat": 46.0898,
    "long": 8.9176
  },
  {
    "zipCode": 6806,
    "city": "Sigirino",
    "lat": 46.0816,
    "long": 8.9165
  },
  {
    "zipCode": 6807,
    "city": "Taverne",
    "lat": 46.0616,
    "long": 8.9287
  },
  {
    "zipCode": 6807,
    "city": "Taverne",
    "lat": 46.0911,
    "long": 8.9864
  },
  {
    "zipCode": 6808,
    "city": "Torricella",
    "lat": 46.0638,
    "long": 8.9233
  },
  {
    "zipCode": 6809,
    "city": "Medeglia",
    "lat": 46.1904,
    "long": 9.0223
  },
  {
    "zipCode": 6809,
    "city": "Medeglia",
    "lat": 46.1153,
    "long": 8.9672
  },
  {
    "zipCode": 6810,
    "city": "Isone",
    "lat": 46.1286,
    "long": 8.9854
  },
  {
    "zipCode": 6814,
    "city": "Cadempino",
    "lat": 46.0367,
    "long": 8.934
  },
  {
    "zipCode": 6814,
    "city": "Lamone",
    "lat": 46.0453,
    "long": 8.9316
  },
  {
    "zipCode": 6815,
    "city": "Melide",
    "lat": 45.9546,
    "long": 8.9472
  },
  {
    "zipCode": 6816,
    "city": "Bissone",
    "lat": 45.9541,
    "long": 8.9666
  },
  {
    "zipCode": 6817,
    "city": "Maroggia",
    "lat": 45.9352,
    "long": 8.9706
  },
  {
    "zipCode": 6818,
    "city": "Melano",
    "lat": 45.922,
    "long": 8.9844
  },
  {
    "zipCode": 6821,
    "city": "Rovio",
    "lat": 45.9331,
    "long": 8.987
  },
  {
    "zipCode": 6822,
    "city": "Arogno",
    "lat": 45.9591,
    "long": 8.9844
  },
  {
    "zipCode": 6823,
    "city": "Pugerna",
    "lat": 45.9798,
    "long": 8.98
  },
  {
    "zipCode": 6825,
    "city": "Capolago",
    "lat": 46.0409,
    "long": 8.9425
  },
  {
    "zipCode": 6825,
    "city": "Capolago",
    "lat": 45.9037,
    "long": 8.9792
  },
  {
    "zipCode": 6826,
    "city": "Riva San Vitale",
    "lat": 45.9012,
    "long": 8.9717
  },
  {
    "zipCode": 6827,
    "city": "Brusino Arsizio",
    "lat": 45.9303,
    "long": 8.9388
  },
  {
    "zipCode": 6828,
    "city": "Balerna",
    "lat": 45.8464,
    "long": 9.0072
  },
  {
    "zipCode": 6830,
    "city": "Chiasso",
    "lat": 45.832,
    "long": 9.0312
  },
  {
    "zipCode": 6832,
    "city": "Seseglio",
    "lat": 45.828,
    "long": 9.0005
  },
  {
    "zipCode": 6832,
    "city": "Pedrinate",
    "lat": 45.8261,
    "long": 9.0132
  },
  {
    "zipCode": 6833,
    "city": "Vacallo",
    "lat": 45.8447,
    "long": 9.0333
  },
  {
    "zipCode": 6834,
    "city": "Morbio Inferiore",
    "lat": 45.8491,
    "long": 9.0191
  },
  {
    "zipCode": 6835,
    "city": "Morbio Superiore",
    "lat": 45.86,
    "long": 9.0232
  },
  {
    "zipCode": 6836,
    "city": "Serfontana",
    "lat": 45.8497,
    "long": 9.0216
  },
  {
    "zipCode": 6837,
    "city": "Caneggio",
    "lat": 45.8725,
    "long": 9.0296
  },
  {
    "zipCode": 6837,
    "city": "Bruzella",
    "lat": 45.8824,
    "long": 9.0393
  },
  {
    "zipCode": 6838,
    "city": "Muggio",
    "lat": 45.9021,
    "long": 9.043
  },
  {
    "zipCode": 6838,
    "city": "Cabbio",
    "lat": 45.8967,
    "long": 9.0474
  },
  {
    "zipCode": 6838,
    "city": "Scudellate",
    "lat": 45.9229,
    "long": 9.0415
  },
  {
    "zipCode": 6839,
    "city": "Sagno",
    "lat": 45.8568,
    "long": 9.0399
  },
  {
    "zipCode": 6850,
    "city": "Mendrisio",
    "lat": 45.8702,
    "long": 8.9816
  },
  {
    "zipCode": 6852,
    "city": "Genestrerio",
    "lat": 45.8533,
    "long": 8.9612
  },
  {
    "zipCode": 6853,
    "city": "Ligornetto",
    "lat": 45.8616,
    "long": 8.9517
  },
  {
    "zipCode": 6854,
    "city": "S. Pietro",
    "lat": 45.8589,
    "long": 8.9379
  },
  {
    "zipCode": 6855,
    "city": "Stabio",
    "lat": 45.8485,
    "long": 8.9364
  },
  {
    "zipCode": 6862,
    "city": "Rancate",
    "lat": 45.8715,
    "long": 8.9671
  },
  {
    "zipCode": 6863,
    "city": "Besazio",
    "lat": 45.8721,
    "long": 8.953
  },
  {
    "zipCode": 6864,
    "city": "Arzo",
    "lat": 45.8761,
    "long": 8.941
  },
  {
    "zipCode": 6865,
    "city": "Tremona",
    "lat": 45.8815,
    "long": 8.9588
  },
  {
    "zipCode": 6866,
    "city": "Meride",
    "lat": 45.8905,
    "long": 8.9529
  },
  {
    "zipCode": 6867,
    "city": "Serpiano",
    "lat": 45.9104,
    "long": 8.928
  },
  {
    "zipCode": 6872,
    "city": "Salorino",
    "lat": 45.8736,
    "long": 8.9953
  },
  {
    "zipCode": 6872,
    "city": "Somazzo",
    "lat": 45.8786,
    "long": 8.9937
  },
  {
    "zipCode": 6873,
    "city": "Corteglia",
    "lat": 45.8623,
    "long": 8.9954
  },
  {
    "zipCode": 6874,
    "city": "Castel San Pietro",
    "lat": 45.8621,
    "long": 9.0084
  },
  {
    "zipCode": 6875,
    "city": "Monte",
    "lat": 45.883,
    "long": 9.0289
  },
  {
    "zipCode": 6875,
    "city": "Campora",
    "lat": 45.8743,
    "long": 9.0238
  },
  {
    "zipCode": 6875,
    "city": "Casima",
    "lat": 45.8906,
    "long": 9.0369
  },
  {
    "zipCode": 6877,
    "city": "Coldrerio",
    "lat": 45.854,
    "long": 8.9877
  },
  {
    "zipCode": 6883,
    "city": "Novazzano",
    "lat": 45.8407,
    "long": 8.9824
  },
  {
    "zipCode": 6900,
    "city": "Lugano",
    "lat": 46.0101,
    "long": 8.96
  },
  {
    "zipCode": 6901,
    "city": "Lugano",
    "lat": 46.0055,
    "long": 8.9714
  },
  {
    "zipCode": 6902,
    "city": "Lugano 2 Caselle",
    "lat": 45.988,
    "long": 8.9483
  },
  {
    "zipCode": 6903,
    "city": "Lugano",
    "lat": 46.0055,
    "long": 8.9714
  },
  {
    "zipCode": 6904,
    "city": "Lugano 4 Caselle",
    "lat": 46.0055,
    "long": 8.9714
  },
  {
    "zipCode": 6906,
    "city": "Lugano 6 Caselle",
    "lat": 46.0055,
    "long": 8.9714
  },
  {
    "zipCode": 6907,
    "city": "Lugano 7 Caselle",
    "lat": 46.0055,
    "long": 8.9714
  },
  {
    "zipCode": 6908,
    "city": "Massagno Caselle",
    "lat": 46.0126,
    "long": 8.9437
  },
  {
    "zipCode": 6912,
    "city": "Pazzallo",
    "lat": 45.9859,
    "long": 8.9444
  },
  {
    "zipCode": 6913,
    "city": "Carabbia",
    "lat": 45.9719,
    "long": 8.937
  },
  {
    "zipCode": 6914,
    "city": "Carona",
    "lat": 45.9574,
    "long": 8.9358
  },
  {
    "zipCode": 6915,
    "city": "Pambio-Noranco",
    "lat": 45.9841,
    "long": 8.9293
  },
  {
    "zipCode": 6916,
    "city": "Grancia",
    "lat": 45.9681,
    "long": 8.9269
  },
  {
    "zipCode": 6917,
    "city": "Barbengo",
    "lat": 45.9588,
    "long": 8.9168
  },
  {
    "zipCode": 6918,
    "city": "Figino",
    "lat": 45.9518,
    "long": 8.907
  },
  {
    "zipCode": 6919,
    "city": "Carabietta",
    "lat": 45.9688,
    "long": 8.9025
  },
  {
    "zipCode": 6921,
    "city": "Vico Morcote",
    "lat": 45.93,
    "long": 8.922
  },
  {
    "zipCode": 6922,
    "city": "Morcote",
    "lat": 45.925,
    "long": 8.916
  },
  {
    "zipCode": 6924,
    "city": "Sorengo",
    "lat": 45.9977,
    "long": 8.9378
  },
  {
    "zipCode": 6925,
    "city": "Gentilino",
    "lat": 45.9916,
    "long": 8.9311
  },
  {
    "zipCode": 6926,
    "city": "Montagnola",
    "lat": 45.9832,
    "long": 8.9179
  },
  {
    "zipCode": 6927,
    "city": "Agra",
    "lat": 45.9679,
    "long": 8.9141
  },
  {
    "zipCode": 6928,
    "city": "Manno",
    "lat": 46.0289,
    "long": 8.9182
  },
  {
    "zipCode": 6929,
    "city": "Gravesano",
    "lat": 46.0421,
    "long": 8.9183
  },
  {
    "zipCode": 6930,
    "city": "Bedano",
    "lat": 46.0512,
    "long": 8.9194
  },
  {
    "zipCode": 6932,
    "city": "Breganzona",
    "lat": 46.0069,
    "long": 8.929
  },
  {
    "zipCode": 6933,
    "city": "Muzzano",
    "lat": 45.9999,
    "long": 8.9165
  },
  {
    "zipCode": 6934,
    "city": "Bioggio",
    "lat": 46.0196,
    "long": 8.9144
  },
  {
    "zipCode": 6935,
    "city": "Bosco Luganese",
    "lat": 46.025,
    "long": 8.9082
  },
  {
    "zipCode": 6936,
    "city": "Cademario",
    "lat": 46.0226,
    "long": 8.8924
  },
  {
    "zipCode": 6937,
    "city": "Breno",
    "lat": 46.0322,
    "long": 8.87
  },
  {
    "zipCode": 6938,
    "city": "Vezio",
    "lat": 46.046,
    "long": 8.8832
  },
  {
    "zipCode": 6938,
    "city": "Fescoggia",
    "lat": 46.0417,
    "long": 8.8778
  },
  {
    "zipCode": 6939,
    "city": "Mugena",
    "lat": 46.0486,
    "long": 8.8893
  },
  {
    "zipCode": 6939,
    "city": "Arosio",
    "lat": 46.0477,
    "long": 8.8997
  },
  {
    "zipCode": 6942,
    "city": "Savosa",
    "lat": 46.0192,
    "long": 8.9447
  },
  {
    "zipCode": 6943,
    "city": "Vezia",
    "lat": 46.0245,
    "long": 8.9358
  },
  {
    "zipCode": 6944,
    "city": "Cureglia",
    "lat": 46.0374,
    "long": 8.9444
  },
  {
    "zipCode": 6945,
    "city": "Origlio",
    "lat": 46.0534,
    "long": 8.9466
  },
  {
    "zipCode": 6946,
    "city": "Ponte Capriasca",
    "lat": 46.0605,
    "long": 8.9482
  },
  {
    "zipCode": 6946,
    "city": "Ponte Capriasca",
    "lat": 46.0605,
    "long": 8.9482
  },
  {
    "zipCode": 6947,
    "city": "Vaglio",
    "lat": 46.0622,
    "long": 8.9585
  },
  {
    "zipCode": 6948,
    "city": "Porza",
    "lat": 46.0268,
    "long": 8.9499
  },
  {
    "zipCode": 6949,
    "city": "Comano",
    "lat": 46.0364,
    "long": 8.9553
  },
  {
    "zipCode": 6950,
    "city": "Tesserete",
    "lat": 46.0681,
    "long": 8.965
  },
  {
    "zipCode": 6951,
    "city": "Colla",
    "lat": 46.0925,
    "long": 9.0542
  },
  {
    "zipCode": 6951,
    "city": "Insone",
    "lat": 46.0864,
    "long": 9.0308
  },
  {
    "zipCode": 6951,
    "city": "Cozzo",
    "lat": 46.0972,
    "long": 9.062
  },
  {
    "zipCode": 6951,
    "city": "Signôra",
    "lat": 46.0926,
    "long": 9.0472
  },
  {
    "zipCode": 6951,
    "city": "Scareglia",
    "lat": 46.0912,
    "long": 9.0382
  },
  {
    "zipCode": 6951,
    "city": "Bogno",
    "lat": 46.0904,
    "long": 9.0625
  },
  {
    "zipCode": 6952,
    "city": "Canobbio",
    "lat": 46.0359,
    "long": 8.966
  },
  {
    "zipCode": 6953,
    "city": "Lugaggia",
    "lat": 46.0626,
    "long": 8.9727
  },
  {
    "zipCode": 6954,
    "city": "Sala Capriasca",
    "lat": 46.0651,
    "long": 8.9561
  },
  {
    "zipCode": 6954,
    "city": "Bigorio",
    "lat": 46.0701,
    "long": 8.957
  },
  {
    "zipCode": 6955,
    "city": "Cagiallo",
    "lat": 46.0673,
    "long": 8.9733
  },
  {
    "zipCode": 6955,
    "city": "Oggio",
    "lat": 46.073,
    "long": 8.9881
  },
  {
    "zipCode": 6955,
    "city": "Oggio",
    "lat": 46.073,
    "long": 8.9881
  },
  {
    "zipCode": 6956,
    "city": "Lopagno",
    "lat": 46.0701,
    "long": 8.9781
  },
  {
    "zipCode": 6957,
    "city": "Roveredo TI",
    "lat": 46.0749,
    "long": 8.9848
  },
  {
    "zipCode": 6958,
    "city": "Bidogno",
    "lat": 46.0786,
    "long": 8.9993
  },
  {
    "zipCode": 6958,
    "city": "Corticiasca",
    "lat": 46.0888,
    "long": 9.0227
  },
  {
    "zipCode": 6958,
    "city": "Corticiasca",
    "lat": 46.0888,
    "long": 9.0227
  },
  {
    "zipCode": 6959,
    "city": "Curtina",
    "lat": 46.0816,
    "long": 9.0241
  },
  {
    "zipCode": 6959,
    "city": "Cimadera",
    "lat": 46.0785,
    "long": 9.0464
  },
  {
    "zipCode": 6959,
    "city": "Maglio di Colla",
    "lat": 46.0816,
    "long": 9.0434
  },
  {
    "zipCode": 6959,
    "city": "Certara",
    "lat": 46.0846,
    "long": 9.0598
  },
  {
    "zipCode": 6959,
    "city": "Piandera Paese",
    "lat": 46.0816,
    "long": 9.0434
  },
  {
    "zipCode": 6959,
    "city": "Piandera Paese",
    "lat": 46.0816,
    "long": 9.0434
  },
  {
    "zipCode": 6960,
    "city": "Odogno",
    "lat": 46.0829,
    "long": 8.9719
  },
  {
    "zipCode": 6962,
    "city": "Viganello",
    "lat": 46.0134,
    "long": 8.9688
  },
  {
    "zipCode": 6963,
    "city": "Cureggia",
    "lat": 46.0208,
    "long": 8.9839
  },
  {
    "zipCode": 6963,
    "city": "Pregassona",
    "lat": 46.0202,
    "long": 8.9743
  },
  {
    "zipCode": 6964,
    "city": "Davesco-Soragno",
    "lat": 46.0376,
    "long": 8.9829
  },
  {
    "zipCode": 6965,
    "city": "Cadro",
    "lat": 46.046,
    "long": 8.9872
  },
  {
    "zipCode": 6966,
    "city": "Villa Luganese",
    "lat": 46.0529,
    "long": 8.9933
  },
  {
    "zipCode": 6967,
    "city": "Dino",
    "lat": 46.053,
    "long": 8.9843
  },
  {
    "zipCode": 6968,
    "city": "Sonvico",
    "lat": 46.058,
    "long": 8.9913
  },
  {
    "zipCode": 6974,
    "city": "Aldesago",
    "lat": 46.008,
    "long": 8.9792
  },
  {
    "zipCode": 6976,
    "city": "Castagnola",
    "lat": 46.005,
    "long": 8.9739
  },
  {
    "zipCode": 6977,
    "city": "Ruvigliana",
    "lat": 46.0037,
    "long": 8.9786
  },
  {
    "zipCode": 6978,
    "city": "Gandria",
    "lat": 46.0055,
    "long": 9.0026
  },
  {
    "zipCode": 6979,
    "city": "Brè sopra Lugano",
    "lat": 46.0115,
    "long": 8.9961
  },
  {
    "zipCode": 6980,
    "city": "Castelrotto",
    "lat": 45.9943,
    "long": 8.8393
  },
  {
    "zipCode": 6981,
    "city": "Bedigliora",
    "lat": 46.0024,
    "long": 8.8393
  },
  {
    "zipCode": 6981,
    "city": "Biogno-Beride",
    "lat": 45.9884,
    "long": 8.8423
  },
  {
    "zipCode": 6981,
    "city": "Bedigliora",
    "lat": 46.0024,
    "long": 8.8393
  },
  {
    "zipCode": 6981,
    "city": "Banco",
    "lat": 46.0094,
    "long": 8.8452
  },
  {
    "zipCode": 6981,
    "city": "Bombinasco",
    "lat": 46.0141,
    "long": 8.8334
  },
  {
    "zipCode": 6982,
    "city": "Agno",
    "lat": 45.9986,
    "long": 8.9003
  },
  {
    "zipCode": 6983,
    "city": "Magliaso",
    "lat": 45.9812,
    "long": 8.888
  },
  {
    "zipCode": 6984,
    "city": "Pura",
    "lat": 45.9865,
    "long": 8.8688
  },
  {
    "zipCode": 6986,
    "city": "Novaggio",
    "lat": 46.0102,
    "long": 8.8561
  },
  {
    "zipCode": 6986,
    "city": "Miglieglia",
    "lat": 46.0238,
    "long": 8.8574
  },
  {
    "zipCode": 6986,
    "city": "Curio",
    "lat": 46.0014,
    "long": 8.8622
  },
  {
    "zipCode": 6987,
    "city": "Caslano",
    "lat": 45.9736,
    "long": 8.8774
  },
  {
    "zipCode": 6988,
    "city": "Ponte Tresa",
    "lat": 45.9717,
    "long": 8.8593
  },
  {
    "zipCode": 6989,
    "city": "Purasca",
    "lat": 45.9775,
    "long": 8.851
  },
  {
    "zipCode": 6990,
    "city": "Cassina d'Agno",
    "lat": 45.9923,
    "long": 8.8904
  },
  {
    "zipCode": 6991,
    "city": "Neggio",
    "lat": 45.9871,
    "long": 8.8797
  },
  {
    "zipCode": 6992,
    "city": "Cimo",
    "lat": 46.0028,
    "long": 8.8915
  },
  {
    "zipCode": 6992,
    "city": "Vernate",
    "lat": 45.9957,
    "long": 8.8841
  },
  {
    "zipCode": 6993,
    "city": "Iseo",
    "lat": 46.0055,
    "long": 8.8809
  },
  {
    "zipCode": 6994,
    "city": "Aranno",
    "lat": 46.018,
    "long": 8.8707
  },
  {
    "zipCode": 6995,
    "city": "Madonna del Piano",
    "lat": 45.9892,
    "long": 8.8332
  },
  {
    "zipCode": 6995,
    "city": "Molinazzo di Monteggio",
    "lat": 45.9924,
    "long": 8.8194
  },
  {
    "zipCode": 6996,
    "city": "Ponte Cremenaga",
    "lat": 45.9921,
    "long": 8.8071
  },
  {
    "zipCode": 6997,
    "city": "Sessa",
    "lat": 45.9986,
    "long": 8.8197
  },
  {
    "zipCode": 6998,
    "city": "Termine",
    "lat": 45.9998,
    "long": 8.7921
  },
  {
    "zipCode": 6999,
    "city": "Astano",
    "lat": 46.0126,
    "long": 8.8152
  },
  {
    "zipCode": 7000,
    "city": "Coire",
    "lat": 46.8499,
    "long": 9.5329
  },
  {
    "zipCode": 7001,
    "city": "Chur",
    "lat": 46.8521,
    "long": 9.5296
  },
  {
    "zipCode": 7004,
    "city": "Chur",
    "lat": 46.8521,
    "long": 9.5296
  },
  {
    "zipCode": 7006,
    "city": "Chur",
    "lat": 46.8521,
    "long": 9.5296
  },
  {
    "zipCode": 7007,
    "city": "Chur",
    "lat": 46.8521,
    "long": 9.5296
  },
  {
    "zipCode": 7012,
    "city": "Felsberg",
    "lat": 46.8442,
    "long": 9.4768
  },
  {
    "zipCode": 7013,
    "city": "Domat/Ems",
    "lat": 46.8348,
    "long": 9.4508
  },
  {
    "zipCode": 7014,
    "city": "Trin",
    "lat": 46.8283,
    "long": 9.3616
  },
  {
    "zipCode": 7015,
    "city": "Tamins",
    "lat": 46.8296,
    "long": 9.4065
  },
  {
    "zipCode": 7016,
    "city": "Trin Mulin",
    "lat": 46.8337,
    "long": 9.3411
  },
  {
    "zipCode": 7017,
    "city": "Flims Dorf",
    "lat": 46.8371,
    "long": 9.2846
  },
  {
    "zipCode": 7018,
    "city": "Flims Waldhaus",
    "lat": 46.8288,
    "long": 9.2898
  },
  {
    "zipCode": 7019,
    "city": "Fidaz",
    "lat": 46.8404,
    "long": 9.3088
  },
  {
    "zipCode": 7023,
    "city": "Haldenstein",
    "lat": 46.8787,
    "long": 9.5262
  },
  {
    "zipCode": 7026,
    "city": "Maladers",
    "lat": 46.8358,
    "long": 9.56
  },
  {
    "zipCode": 7027,
    "city": "Lüen",
    "lat": 46.8331,
    "long": 9.6142
  },
  {
    "zipCode": 7027,
    "city": "Castiel",
    "lat": 46.8394,
    "long": 9.6036
  },
  {
    "zipCode": 7027,
    "city": "Calfreisen",
    "lat": 46.8363,
    "long": 9.6089
  },
  {
    "zipCode": 7028,
    "city": "Pagig",
    "lat": 46.833,
    "long": 9.6509
  },
  {
    "zipCode": 7028,
    "city": "St. Peter",
    "lat": 46.833,
    "long": 9.6509
  },
  {
    "zipCode": 7029,
    "city": "Peist",
    "lat": 46.8333,
    "long": 9.6741
  },
  {
    "zipCode": 7031,
    "city": "Laax GR",
    "lat": 46.8065,
    "long": 9.5375
  },
  {
    "zipCode": 7032,
    "city": "Laax GR 2",
    "lat": 46.846,
    "long": 9.2279
  },
  {
    "zipCode": 7050,
    "city": "Arosa",
    "lat": 46.7779,
    "long": 9.6762
  },
  {
    "zipCode": 7056,
    "city": "Molinis",
    "lat": 46.8261,
    "long": 9.6574
  },
  {
    "zipCode": 7057,
    "city": "Langwies",
    "lat": 46.8192,
    "long": 9.7094
  },
  {
    "zipCode": 7058,
    "city": "Litzirüti",
    "lat": 46.7994,
    "long": 9.7046
  },
  {
    "zipCode": 7062,
    "city": "Passugg",
    "lat": 46.8297,
    "long": 9.548
  },
  {
    "zipCode": 7063,
    "city": "Praden",
    "lat": 46.8243,
    "long": 9.5815
  },
  {
    "zipCode": 7064,
    "city": "Tschiertschen",
    "lat": 46.8177,
    "long": 9.6064
  },
  {
    "zipCode": 7074,
    "city": "Malix",
    "lat": 46.8125,
    "long": 9.532
  },
  {
    "zipCode": 7075,
    "city": "Churwalden",
    "lat": 46.7814,
    "long": 9.5438
  },
  {
    "zipCode": 7076,
    "city": "Parpan",
    "lat": 46.7601,
    "long": 9.5571
  },
  {
    "zipCode": 7077,
    "city": "Valbella",
    "lat": 46.7473,
    "long": 9.5542
  },
  {
    "zipCode": 7078,
    "city": "Lenzerheide/Lai",
    "lat": 46.7222,
    "long": 9.559
  },
  {
    "zipCode": 7082,
    "city": "Vaz/Obervaz",
    "lat": 46.717,
    "long": 9.5413
  },
  {
    "zipCode": 7083,
    "city": "Lantsch/Lenz",
    "lat": 46.6841,
    "long": 9.5627
  },
  {
    "zipCode": 7084,
    "city": "Brienz/Brinzauls GR",
    "lat": 46.6683,
    "long": 9.5951
  },
  {
    "zipCode": 7104,
    "city": "Arezen",
    "lat": 46.7823,
    "long": 9.3344
  },
  {
    "zipCode": 7104,
    "city": "Versam",
    "lat": 46.7921,
    "long": 9.3378
  },
  {
    "zipCode": 7104,
    "city": "Versam",
    "lat": 46.7921,
    "long": 9.3378
  },
  {
    "zipCode": 7106,
    "city": "Tenna",
    "lat": 46.7477,
    "long": 9.3395
  },
  {
    "zipCode": 7107,
    "city": "Safien Platz",
    "lat": 46.6826,
    "long": 9.3157
  },
  {
    "zipCode": 7109,
    "city": "Thalkirch",
    "lat": 46.638,
    "long": 9.2804
  },
  {
    "zipCode": 7110,
    "city": "Peiden",
    "lat": 46.7207,
    "long": 9.1961
  },
  {
    "zipCode": 7111,
    "city": "Pitasch",
    "lat": 46.7315,
    "long": 9.2182
  },
  {
    "zipCode": 7112,
    "city": "Duvin",
    "lat": 46.715,
    "long": 9.2121
  },
  {
    "zipCode": 7113,
    "city": "Camuns",
    "lat": 46.7049,
    "long": 9.1996
  },
  {
    "zipCode": 7114,
    "city": "Uors (Lumnezia)",
    "lat": 46.702,
    "long": 9.1834
  },
  {
    "zipCode": 7115,
    "city": "Surcasti",
    "lat": 46.6972,
    "long": 9.1785
  },
  {
    "zipCode": 7116,
    "city": "St. Martin (Lugnez)",
    "lat": 46.5736,
    "long": 9.1308
  },
  {
    "zipCode": 7116,
    "city": "Tersnaus",
    "lat": 46.6932,
    "long": 9.1858
  },
  {
    "zipCode": 7122,
    "city": "Carrera",
    "lat": 46.7885,
    "long": 9.2961
  },
  {
    "zipCode": 7122,
    "city": "Valendas",
    "lat": 46.7878,
    "long": 9.2826
  },
  {
    "zipCode": 7126,
    "city": "Castrisch",
    "lat": 46.7773,
    "long": 9.2312
  },
  {
    "zipCode": 7127,
    "city": "Sevgein",
    "lat": 46.7655,
    "long": 9.22
  },
  {
    "zipCode": 7128,
    "city": "Riein",
    "lat": 46.7445,
    "long": 9.2328
  },
  {
    "zipCode": 7130,
    "city": "Schnaus",
    "lat": 46.7761,
    "long": 9.1797
  },
  {
    "zipCode": 7130,
    "city": "Ilanz",
    "lat": 46.7741,
    "long": 9.2046
  },
  {
    "zipCode": 7130,
    "city": "Schnaus",
    "lat": 46.7761,
    "long": 9.1797
  },
  {
    "zipCode": 7132,
    "city": "Vals",
    "lat": 46.6165,
    "long": 9.1803
  },
  {
    "zipCode": 7134,
    "city": "Obersaxen",
    "lat": 46.75,
    "long": 9.1
  },
  {
    "zipCode": 7137,
    "city": "Flond",
    "lat": 46.7677,
    "long": 9.1644
  },
  {
    "zipCode": 7138,
    "city": "Surcuolm",
    "lat": 46.7585,
    "long": 9.1452
  },
  {
    "zipCode": 7141,
    "city": "Luven",
    "lat": 46.7611,
    "long": 9.199
  },
  {
    "zipCode": 7142,
    "city": "Cumbel",
    "lat": 46.7258,
    "long": 9.1926
  },
  {
    "zipCode": 7143,
    "city": "Morissen",
    "lat": 46.729,
    "long": 9.1813
  },
  {
    "zipCode": 7144,
    "city": "Vella",
    "lat": 46.718,
    "long": 9.1722
  },
  {
    "zipCode": 7145,
    "city": "Degen",
    "lat": 46.7095,
    "long": 9.1698
  },
  {
    "zipCode": 7146,
    "city": "Vattiz",
    "lat": 46.7073,
    "long": 9.1599
  },
  {
    "zipCode": 7147,
    "city": "Vignogn",
    "lat": 46.6996,
    "long": 9.1561
  },
  {
    "zipCode": 7148,
    "city": "Lumbrein",
    "lat": 46.6838,
    "long": 9.1366
  },
  {
    "zipCode": 7149,
    "city": "Vrin",
    "lat": 46.6555,
    "long": 9.0995
  },
  {
    "zipCode": 7151,
    "city": "Schluein",
    "lat": 46.7882,
    "long": 9.226
  },
  {
    "zipCode": 7152,
    "city": "Sagogn",
    "lat": 46.7937,
    "long": 9.257
  },
  {
    "zipCode": 7153,
    "city": "Falera",
    "lat": 46.8013,
    "long": 9.2309
  },
  {
    "zipCode": 7154,
    "city": "Ruschein",
    "lat": 46.7853,
    "long": 9.1925
  },
  {
    "zipCode": 7155,
    "city": "Ladir",
    "lat": 46.7903,
    "long": 9.2014
  },
  {
    "zipCode": 7155,
    "city": "Ladir",
    "lat": 46.7903,
    "long": 9.2014
  },
  {
    "zipCode": 7156,
    "city": "Rueun",
    "lat": 46.7778,
    "long": 9.1484
  },
  {
    "zipCode": 7156,
    "city": "Pigniu",
    "lat": 46.7778,
    "long": 9.1484
  },
  {
    "zipCode": 7157,
    "city": "Siat",
    "lat": 46.7908,
    "long": 9.1624
  },
  {
    "zipCode": 7158,
    "city": "Waltensburg/Vuorz",
    "lat": 46.7737,
    "long": 9.1085
  },
  {
    "zipCode": 7159,
    "city": "Andiast",
    "lat": 46.7843,
    "long": 9.1137
  },
  {
    "zipCode": 7162,
    "city": "Tavanasa",
    "lat": 46.7546,
    "long": 9.0623
  },
  {
    "zipCode": 7163,
    "city": "Danis",
    "lat": 46.7551,
    "long": 9.055
  },
  {
    "zipCode": 7164,
    "city": "Dardin",
    "lat": 46.7591,
    "long": 9.0485
  },
  {
    "zipCode": 7165,
    "city": "Breil/Brigels",
    "lat": 46.7699,
    "long": 9.0604
  },
  {
    "zipCode": 7166,
    "city": "Trun",
    "lat": 46.7429,
    "long": 8.9872
  },
  {
    "zipCode": 7167,
    "city": "Zignau",
    "lat": 46.74,
    "long": 9.0056
  },
  {
    "zipCode": 7168,
    "city": "Schlans",
    "lat": 46.7536,
    "long": 9.0157
  },
  {
    "zipCode": 7172,
    "city": "Rabius",
    "lat": 46.7343,
    "long": 8.9588
  },
  {
    "zipCode": 7173,
    "city": "Surrein",
    "lat": 46.7231,
    "long": 8.9491
  },
  {
    "zipCode": 7174,
    "city": "S. Benedetg",
    "lat": 46.7356,
    "long": 8.9398
  },
  {
    "zipCode": 7175,
    "city": "Sumvitg",
    "lat": 46.7284,
    "long": 8.9388
  },
  {
    "zipCode": 7176,
    "city": "Cumpadials",
    "lat": 46.7241,
    "long": 8.9238
  },
  {
    "zipCode": 7180,
    "city": "Disentis/Mustér",
    "lat": 46.7034,
    "long": 8.8509
  },
  {
    "zipCode": 7182,
    "city": "Cavardiras",
    "lat": 46.7112,
    "long": 8.8856
  },
  {
    "zipCode": 7183,
    "city": "Mumpé Medel",
    "lat": 46.6844,
    "long": 8.8209
  },
  {
    "zipCode": 7184,
    "city": "Curaglia",
    "lat": 46.6734,
    "long": 8.8579
  },
  {
    "zipCode": 7185,
    "city": "Platta",
    "lat": 46.6582,
    "long": 8.8539
  },
  {
    "zipCode": 7186,
    "city": "Segnas",
    "lat": 46.6948,
    "long": 8.829
  },
  {
    "zipCode": 7187,
    "city": "Camischolas",
    "lat": 46.6806,
    "long": 8.7646
  },
  {
    "zipCode": 7188,
    "city": "Sedrun",
    "lat": 46.6793,
    "long": 8.7731
  },
  {
    "zipCode": 7189,
    "city": "Rueras",
    "lat": 46.6739,
    "long": 8.7521
  },
  {
    "zipCode": 7202,
    "city": "Says",
    "lat": 46.9074,
    "long": 9.5824
  },
  {
    "zipCode": 7203,
    "city": "Trimmis",
    "lat": 46.9008,
    "long": 9.5612
  },
  {
    "zipCode": 7204,
    "city": "Untervaz",
    "lat": 46.9275,
    "long": 9.5342
  },
  {
    "zipCode": 7205,
    "city": "Zizers",
    "lat": 46.9358,
    "long": 9.5649
  },
  {
    "zipCode": 7206,
    "city": "Igis",
    "lat": 46.9453,
    "long": 9.5722
  },
  {
    "zipCode": 7208,
    "city": "Malans GR",
    "lat": 46.981,
    "long": 9.5753
  },
  {
    "zipCode": 7212,
    "city": "Seewis Dorf",
    "lat": 46.9902,
    "long": 9.6377
  },
  {
    "zipCode": 7212,
    "city": "Seewis-Schmitten",
    "lat": 46.9804,
    "long": 9.6407
  },
  {
    "zipCode": 7212,
    "city": "Seewis-Pardisla",
    "lat": 46.9811,
    "long": 9.6359
  },
  {
    "zipCode": 7213,
    "city": "Valzeina",
    "lat": 46.9502,
    "long": 9.6027
  },
  {
    "zipCode": 7214,
    "city": "Grüsch",
    "lat": 46.9796,
    "long": 9.6464
  },
  {
    "zipCode": 7215,
    "city": "Fanas",
    "lat": 46.9849,
    "long": 9.6667
  },
  {
    "zipCode": 7220,
    "city": "Schiers",
    "lat": 46.9697,
    "long": 9.6872
  },
  {
    "zipCode": 7220,
    "city": "Schiers",
    "lat": 46.9697,
    "long": 9.6872
  },
  {
    "zipCode": 7222,
    "city": "Lunden",
    "lat": 46.9513,
    "long": 9.7143
  },
  {
    "zipCode": 7223,
    "city": "Buchen im Prättigau",
    "lat": 46.9418,
    "long": 9.7184
  },
  {
    "zipCode": 7224,
    "city": "Putz",
    "lat": 46.9261,
    "long": 9.747
  },
  {
    "zipCode": 7226,
    "city": "Stels",
    "lat": 46.9712,
    "long": 9.7019
  },
  {
    "zipCode": 7226,
    "city": "Stels",
    "lat": 46.9712,
    "long": 9.7019
  },
  {
    "zipCode": 7226,
    "city": "Fajauna",
    "lat": 46.9712,
    "long": 9.7019
  },
  {
    "zipCode": 7228,
    "city": "Schuders",
    "lat": 46.9913,
    "long": 9.7379
  },
  {
    "zipCode": 7228,
    "city": "Pusserein",
    "lat": 46.9856,
    "long": 9.708
  },
  {
    "zipCode": 7231,
    "city": "Pragg-Jenaz",
    "lat": 46.9402,
    "long": 9.7053
  },
  {
    "zipCode": 7232,
    "city": "Furna",
    "lat": 46.9369,
    "long": 9.6787
  },
  {
    "zipCode": 7233,
    "city": "Jenaz",
    "lat": 46.9289,
    "long": 9.7128
  },
  {
    "zipCode": 7235,
    "city": "Fideris",
    "lat": 46.9163,
    "long": 9.7415
  },
  {
    "zipCode": 7240,
    "city": "Küblis",
    "lat": 46.9145,
    "long": 9.7793
  },
  {
    "zipCode": 7241,
    "city": "Conters im Prättigau",
    "lat": 46.9,
    "long": 9.7833
  },
  {
    "zipCode": 7242,
    "city": "Luzein",
    "lat": 46.9196,
    "long": 9.7608
  },
  {
    "zipCode": 7243,
    "city": "Pany",
    "lat": 46.9289,
    "long": 9.7715
  },
  {
    "zipCode": 7244,
    "city": "Gadenstätt",
    "lat": 46.9452,
    "long": 9.7945
  },
  {
    "zipCode": 7245,
    "city": "Ascharina",
    "lat": 46.9516,
    "long": 9.8054
  },
  {
    "zipCode": 7246,
    "city": "St. Antönien",
    "lat": 46.9466,
    "long": 9.7618
  },
  {
    "zipCode": 7247,
    "city": "Saas im Prättigau",
    "lat": 46.8548,
    "long": 9.9537
  },
  {
    "zipCode": 7249,
    "city": "Serneus",
    "lat": 46.8892,
    "long": 9.8383
  },
  {
    "zipCode": 7250,
    "city": "Klosters",
    "lat": 46.8827,
    "long": 9.8761
  },
  {
    "zipCode": 7252,
    "city": "Klosters Dorf",
    "lat": 46.8827,
    "long": 9.8761
  },
  {
    "zipCode": 7260,
    "city": "Davos Dorf",
    "lat": 46.8083,
    "long": 9.8393
  },
  {
    "zipCode": 7265,
    "city": "Davos Wolfgang",
    "lat": 46.8334,
    "long": 9.8537
  },
  {
    "zipCode": 7270,
    "city": "Davos Platz",
    "lat": 46.7961,
    "long": 9.8176
  },
  {
    "zipCode": 7272,
    "city": "Davos Clavadel",
    "lat": 46.7688,
    "long": 9.8152
  },
  {
    "zipCode": 7276,
    "city": "Davos Frauenkirch",
    "lat": 46.7658,
    "long": 9.7975
  },
  {
    "zipCode": 7277,
    "city": "Davos Glaris",
    "lat": 46.7452,
    "long": 9.776
  },
  {
    "zipCode": 7278,
    "city": "Davos Monstein",
    "lat": 46.7116,
    "long": 9.7725
  },
  {
    "zipCode": 7302,
    "city": "Landquart",
    "lat": 46.95,
    "long": 9.5667
  },
  {
    "zipCode": 7303,
    "city": "Mastrils",
    "lat": 46.9697,
    "long": 9.5446
  },
  {
    "zipCode": 7304,
    "city": "Maienfeld",
    "lat": 47.0047,
    "long": 9.5312
  },
  {
    "zipCode": 7306,
    "city": "Fläsch",
    "lat": 47.0257,
    "long": 9.5136
  },
  {
    "zipCode": 7307,
    "city": "Jenins",
    "lat": 47.0015,
    "long": 9.5566
  },
  {
    "zipCode": 7310,
    "city": "Bad Ragaz",
    "lat": 47.006,
    "long": 9.5027
  },
  {
    "zipCode": 7310,
    "city": "Bad Ragaz",
    "lat": 46.933,
    "long": 9.4068
  },
  {
    "zipCode": 7312,
    "city": "Pfäfers",
    "lat": 46.9899,
    "long": 9.5008
  },
  {
    "zipCode": 7313,
    "city": "St. Margrethenberg",
    "lat": 46.9769,
    "long": 9.5127
  },
  {
    "zipCode": 7314,
    "city": "Vadura",
    "lat": 46.9562,
    "long": 9.4851
  },
  {
    "zipCode": 7315,
    "city": "Vättis",
    "lat": 46.9097,
    "long": 9.4427
  },
  {
    "zipCode": 7317,
    "city": "Valens",
    "lat": 46.9666,
    "long": 9.477
  },
  {
    "zipCode": 7317,
    "city": "Vasön",
    "lat": 46.9528,
    "long": 9.4773
  },
  {
    "zipCode": 7320,
    "city": "Sargans",
    "lat": 47.049,
    "long": 9.441
  },
  {
    "zipCode": 7323,
    "city": "Wangs",
    "lat": 47.0326,
    "long": 9.4329
  },
  {
    "zipCode": 7324,
    "city": "Vilters",
    "lat": 47.0261,
    "long": 9.4532
  },
  {
    "zipCode": 7325,
    "city": "Schwendi im Weisstannental",
    "lat": 47.0078,
    "long": 9.3652
  },
  {
    "zipCode": 7326,
    "city": "Weisstannen",
    "lat": 46.9911,
    "long": 9.3426
  },
  {
    "zipCode": 7402,
    "city": "Bonaduz",
    "lat": 46.811,
    "long": 9.3982
  },
  {
    "zipCode": 7403,
    "city": "Rhäzüns",
    "lat": 46.7989,
    "long": 9.3976
  },
  {
    "zipCode": 7404,
    "city": "Feldis/Veulden",
    "lat": 46.7942,
    "long": 9.432
  },
  {
    "zipCode": 7405,
    "city": "Rothenbrunnen",
    "lat": 46.7677,
    "long": 9.427
  },
  {
    "zipCode": 7407,
    "city": "Trans",
    "lat": 46.7649,
    "long": 9.4613
  },
  {
    "zipCode": 7408,
    "city": "Realta",
    "lat": 46.7319,
    "long": 9.4277
  },
  {
    "zipCode": 7408,
    "city": "Cazis",
    "lat": 46.7194,
    "long": 9.4327
  },
  {
    "zipCode": 7411,
    "city": "Sils im Domleschg",
    "lat": 46.7004,
    "long": 9.454
  },
  {
    "zipCode": 7412,
    "city": "Scharans",
    "lat": 46.7181,
    "long": 9.459
  },
  {
    "zipCode": 7413,
    "city": "Fürstenaubruck",
    "lat": 46.7119,
    "long": 9.4533
  },
  {
    "zipCode": 7414,
    "city": "Fürstenau",
    "lat": 46.7119,
    "long": 9.4533
  },
  {
    "zipCode": 7415,
    "city": "Rodels",
    "lat": 46.7372,
    "long": 9.4447
  },
  {
    "zipCode": 7415,
    "city": "Pratval",
    "lat": 46.732,
    "long": 9.4485
  },
  {
    "zipCode": 7416,
    "city": "Almens",
    "lat": 46.7381,
    "long": 9.4592
  },
  {
    "zipCode": 7417,
    "city": "Paspels",
    "lat": 46.7488,
    "long": 9.4435
  },
  {
    "zipCode": 7418,
    "city": "Tumegl/Tomils",
    "lat": 46.7618,
    "long": 9.4424
  },
  {
    "zipCode": 7419,
    "city": "Scheid",
    "lat": 46.7772,
    "long": 9.4485
  },
  {
    "zipCode": 7421,
    "city": "Summaprada",
    "lat": 46.7147,
    "long": 9.4331
  },
  {
    "zipCode": 7422,
    "city": "Tartar",
    "lat": 46.7176,
    "long": 9.4186
  },
  {
    "zipCode": 7423,
    "city": "Portein",
    "lat": 46.7105,
    "long": 9.4066
  },
  {
    "zipCode": 7423,
    "city": "Sarn",
    "lat": 46.7223,
    "long": 9.4063
  },
  {
    "zipCode": 7424,
    "city": "Dalin",
    "lat": 46.7364,
    "long": 9.4056
  },
  {
    "zipCode": 7424,
    "city": "Präz",
    "lat": 46.7419,
    "long": 9.4054
  },
  {
    "zipCode": 7425,
    "city": "Masein",
    "lat": 46.7036,
    "long": 9.4267
  },
  {
    "zipCode": 7426,
    "city": "Flerden",
    "lat": 46.7033,
    "long": 9.4082
  },
  {
    "zipCode": 7426,
    "city": "Flerden",
    "lat": 46.7033,
    "long": 9.4082
  },
  {
    "zipCode": 7427,
    "city": "Urmein",
    "lat": 46.6918,
    "long": 9.4008
  },
  {
    "zipCode": 7428,
    "city": "Tschappina",
    "lat": 46.6869,
    "long": 9.3834
  },
  {
    "zipCode": 7428,
    "city": "Glaspass",
    "lat": 46.677,
    "long": 9.3474
  },
  {
    "zipCode": 7430,
    "city": "Thusis",
    "lat": 46.6972,
    "long": 9.4394
  },
  {
    "zipCode": 7430,
    "city": "Rongellen",
    "lat": 46.6744,
    "long": 9.4418
  },
  {
    "zipCode": 7431,
    "city": "Mutten",
    "lat": 46.6781,
    "long": 9.5
  },
  {
    "zipCode": 7431,
    "city": "Obermutten",
    "lat": 46.6709,
    "long": 9.4863
  },
  {
    "zipCode": 7432,
    "city": "Zillis",
    "lat": 46.6341,
    "long": 9.4423
  },
  {
    "zipCode": 7433,
    "city": "Mathon",
    "lat": 46.636,
    "long": 9.4138
  },
  {
    "zipCode": 7433,
    "city": "Wergenstein",
    "lat": 46.6265,
    "long": 9.4069
  },
  {
    "zipCode": 7433,
    "city": "Donat",
    "lat": 46.6322,
    "long": 9.4257
  },
  {
    "zipCode": 7433,
    "city": "Farden",
    "lat": 46.6327,
    "long": 9.4241
  },
  {
    "zipCode": 7433,
    "city": "Lohn GR",
    "lat": 46.6574,
    "long": 9.4232
  },
  {
    "zipCode": 7434,
    "city": "Sufers",
    "lat": 46.5703,
    "long": 9.3659
  },
  {
    "zipCode": 7435,
    "city": "Splügen",
    "lat": 46.5518,
    "long": 9.3222
  },
  {
    "zipCode": 7436,
    "city": "Medels im Rheinwald",
    "lat": 46.5469,
    "long": 9.2941
  },
  {
    "zipCode": 7437,
    "city": "Nufenen",
    "lat": 46.5398,
    "long": 9.2451
  },
  {
    "zipCode": 7438,
    "city": "Hinterrhein",
    "lat": 46.5333,
    "long": 9.2
  },
  {
    "zipCode": 7440,
    "city": "Andeer",
    "lat": 46.6034,
    "long": 9.4261
  },
  {
    "zipCode": 7442,
    "city": "Clugin",
    "lat": 46.6165,
    "long": 9.4256
  },
  {
    "zipCode": 7443,
    "city": "Pignia",
    "lat": 46.6143,
    "long": 9.4381
  },
  {
    "zipCode": 7444,
    "city": "Ausserferrera",
    "lat": 46.5567,
    "long": 9.4396
  },
  {
    "zipCode": 7445,
    "city": "Innerferrera",
    "lat": 46.5212,
    "long": 9.4431
  },
  {
    "zipCode": 7445,
    "city": "Innerferrera",
    "lat": 46.5212,
    "long": 9.4431
  },
  {
    "zipCode": 7446,
    "city": "Campsut-Cröt",
    "lat": 46.4869,
    "long": 9.4782
  },
  {
    "zipCode": 7447,
    "city": "Cresta (Avers)",
    "lat": 46.4468,
    "long": 9.5306
  },
  {
    "zipCode": 7447,
    "city": "Am Bach (Avers)",
    "lat": 46.4586,
    "long": 9.5374
  },
  {
    "zipCode": 7448,
    "city": "Juf",
    "lat": 46.4453,
    "long": 9.5795
  },
  {
    "zipCode": 7450,
    "city": "Tiefencastel",
    "lat": 46.6601,
    "long": 9.5788
  },
  {
    "zipCode": 7450,
    "city": "Tiefencastel",
    "lat": 46.7257,
    "long": 9.5415
  },
  {
    "zipCode": 7451,
    "city": "Alvaschein",
    "lat": 46.6753,
    "long": 9.5506
  },
  {
    "zipCode": 7452,
    "city": "Cunter",
    "lat": 46.6096,
    "long": 9.5898
  },
  {
    "zipCode": 7453,
    "city": "Tinizong",
    "lat": 46.5824,
    "long": 9.6173
  },
  {
    "zipCode": 7454,
    "city": "Rona",
    "lat": 46.5613,
    "long": 9.6253
  },
  {
    "zipCode": 7455,
    "city": "Mulegns",
    "lat": 46.5242,
    "long": 9.6209
  },
  {
    "zipCode": 7456,
    "city": "Sur",
    "lat": 46.5703,
    "long": 9.3659
  },
  {
    "zipCode": 7456,
    "city": "Marmorera",
    "lat": 46.4972,
    "long": 9.6435
  },
  {
    "zipCode": 7457,
    "city": "Bivio",
    "lat": 46.4685,
    "long": 9.6509
  },
  {
    "zipCode": 7458,
    "city": "Mon",
    "lat": 46.6498,
    "long": 9.5647
  },
  {
    "zipCode": 7459,
    "city": "Stierva",
    "lat": 46.6637,
    "long": 9.5423
  },
  {
    "zipCode": 7460,
    "city": "Savognin",
    "lat": 46.5973,
    "long": 9.5982
  },
  {
    "zipCode": 7462,
    "city": "Salouf",
    "lat": 46.6244,
    "long": 9.5761
  },
  {
    "zipCode": 7463,
    "city": "Riom",
    "lat": 46.6093,
    "long": 9.582
  },
  {
    "zipCode": 7463,
    "city": "Riom",
    "lat": 46.6093,
    "long": 9.582
  },
  {
    "zipCode": 7464,
    "city": "Parsonz",
    "lat": 46.6111,
    "long": 9.573
  },
  {
    "zipCode": 7472,
    "city": "Surava",
    "lat": 46.6661,
    "long": 9.613
  },
  {
    "zipCode": 7473,
    "city": "Alvaneu Bad",
    "lat": 46.6696,
    "long": 9.6473
  },
  {
    "zipCode": 7477,
    "city": "Filisur",
    "lat": 46.673,
    "long": 9.6859
  },
  {
    "zipCode": 7482,
    "city": "Bergün/Bravuogn",
    "lat": 46.6293,
    "long": 9.7476
  },
  {
    "zipCode": 7482,
    "city": "Preda",
    "lat": 46.5886,
    "long": 9.7765
  },
  {
    "zipCode": 7482,
    "city": "Stugl/Stuls",
    "lat": 46.6506,
    "long": 9.7317
  },
  {
    "zipCode": 7484,
    "city": "Latsch",
    "lat": 46.6342,
    "long": 9.7521
  },
  {
    "zipCode": 7492,
    "city": "Alvaneu Dorf",
    "lat": 46.6788,
    "long": 9.6463
  },
  {
    "zipCode": 7493,
    "city": "Schmitten (Albula)",
    "lat": 46.6869,
    "long": 9.6732
  },
  {
    "zipCode": 7494,
    "city": "Davos Wiesen",
    "lat": 46.7039,
    "long": 9.7139
  },
  {
    "zipCode": 7500,
    "city": "St. Moritz",
    "lat": 46.4994,
    "long": 9.8433
  },
  {
    "zipCode": 7502,
    "city": "Bever",
    "lat": 46.55,
    "long": 9.8833
  },
  {
    "zipCode": 7502,
    "city": "Bever",
    "lat": 46.55,
    "long": 9.8833
  },
  {
    "zipCode": 7503,
    "city": "Samedan",
    "lat": 46.534,
    "long": 9.8728
  },
  {
    "zipCode": 7504,
    "city": "Pontresina",
    "lat": 46.4955,
    "long": 9.9013
  },
  {
    "zipCode": 7505,
    "city": "Celerina/Schlarigna",
    "lat": 46.5122,
    "long": 9.8579
  },
  {
    "zipCode": 7512,
    "city": "Champfèr",
    "lat": 46.4763,
    "long": 9.81
  },
  {
    "zipCode": 7513,
    "city": "Silvaplana-Surlej",
    "lat": 46.458,
    "long": 9.8114
  },
  {
    "zipCode": 7513,
    "city": "Silvaplana",
    "lat": 46.4581,
    "long": 9.7951
  },
  {
    "zipCode": 7514,
    "city": "Fex",
    "lat": 46.4137,
    "long": 9.7644
  },
  {
    "zipCode": 7514,
    "city": "Sils/Segl Maria",
    "lat": 46.4289,
    "long": 9.7636
  },
  {
    "zipCode": 7515,
    "city": "Sils/Segl Baselgia",
    "lat": 46.4347,
    "long": 9.7569
  },
  {
    "zipCode": 7516,
    "city": "Maloja",
    "lat": 46.4039,
    "long": 9.6949
  },
  {
    "zipCode": 7517,
    "city": "Plaun da Lej",
    "lat": 46.4214,
    "long": 9.7263
  },
  {
    "zipCode": 7522,
    "city": "La Punt-Chamues-ch",
    "lat": 46.5789,
    "long": 9.9201
  },
  {
    "zipCode": 7523,
    "city": "Madulain",
    "lat": 46.5877,
    "long": 9.9395
  },
  {
    "zipCode": 7523,
    "city": "Madulain",
    "lat": 46.5877,
    "long": 9.9395
  },
  {
    "zipCode": 7524,
    "city": "Zuoz",
    "lat": 46.6021,
    "long": 9.9597
  },
  {
    "zipCode": 7524,
    "city": "Zuoz",
    "lat": 46.6021,
    "long": 9.9597
  },
  {
    "zipCode": 7525,
    "city": "S-chanf",
    "lat": 46.6125,
    "long": 9.9846
  },
  {
    "zipCode": 7526,
    "city": "Cinuos-chel",
    "lat": 46.643,
    "long": 10.0231
  },
  {
    "zipCode": 7527,
    "city": "Brail",
    "lat": 46.6555,
    "long": 10.0351
  },
  {
    "zipCode": 7530,
    "city": "Zernez",
    "lat": 46.6986,
    "long": 10.0927
  },
  {
    "zipCode": 7532,
    "city": "Tschierv",
    "lat": 46.6261,
    "long": 10.3388
  },
  {
    "zipCode": 7533,
    "city": "Fuldera",
    "lat": 46.6089,
    "long": 10.3715
  },
  {
    "zipCode": 7534,
    "city": "Lü",
    "lat": 46.623,
    "long": 10.3689
  },
  {
    "zipCode": 7535,
    "city": "Valchava",
    "lat": 46.6008,
    "long": 10.4069
  },
  {
    "zipCode": 7536,
    "city": "Sta. Maria Val Müstair",
    "lat": 46.6012,
    "long": 10.423
  },
  {
    "zipCode": 7537,
    "city": "Müstair",
    "lat": 46.6268,
    "long": 10.4462
  },
  {
    "zipCode": 7542,
    "city": "Susch",
    "lat": 46.6714,
    "long": 10.1217
  },
  {
    "zipCode": 7543,
    "city": "Lavin",
    "lat": 46.6714,
    "long": 10.1217
  },
  {
    "zipCode": 7545,
    "city": "Guarda",
    "lat": 46.7346,
    "long": 10.3264
  },
  {
    "zipCode": 7546,
    "city": "Ardez",
    "lat": 46.7346,
    "long": 10.3264
  },
  {
    "zipCode": 7550,
    "city": "Scuol",
    "lat": 46.7967,
    "long": 10.298
  },
  {
    "zipCode": 7551,
    "city": "Ftan",
    "lat": 46.7346,
    "long": 10.3264
  },
  {
    "zipCode": 7552,
    "city": "Vulpera",
    "lat": 46.7863,
    "long": 10.2835
  },
  {
    "zipCode": 7553,
    "city": "Tarasp",
    "lat": 46.7346,
    "long": 10.3264
  },
  {
    "zipCode": 7554,
    "city": "Sent",
    "lat": 46.7346,
    "long": 10.3264
  },
  {
    "zipCode": 7554,
    "city": "Crusch",
    "lat": 46.7346,
    "long": 10.3264
  },
  {
    "zipCode": 7556,
    "city": "Ramosch",
    "lat": 46.8339,
    "long": 10.3815
  },
  {
    "zipCode": 7556,
    "city": "Ramosch",
    "lat": 46.8339,
    "long": 10.3815
  },
  {
    "zipCode": 7557,
    "city": "Vnà",
    "lat": 46.844,
    "long": 10.3648
  },
  {
    "zipCode": 7558,
    "city": "Strada",
    "lat": 46.8638,
    "long": 10.4364
  },
  {
    "zipCode": 7559,
    "city": "Tschlin",
    "lat": 46.8698,
    "long": 10.4255
  },
  {
    "zipCode": 7560,
    "city": "Martina",
    "lat": 46.8846,
    "long": 10.4632
  },
  {
    "zipCode": 7562,
    "city": "Samnaun-Compatsch",
    "lat": 46.9596,
    "long": 10.4002
  },
  {
    "zipCode": 7563,
    "city": "Samnaun Dorf",
    "lat": 46.9437,
    "long": 10.3606
  },
  {
    "zipCode": 7602,
    "city": "Casaccia",
    "lat": 46.391,
    "long": 9.6661
  },
  {
    "zipCode": 7603,
    "city": "Vicosoprano",
    "lat": 46.3511,
    "long": 9.6208
  },
  {
    "zipCode": 7604,
    "city": "Borgonovo",
    "lat": 46.3476,
    "long": 9.6041
  },
  {
    "zipCode": 7605,
    "city": "Stampa",
    "lat": 46.3429,
    "long": 9.5907
  },
  {
    "zipCode": 7606,
    "city": "Promontogno",
    "lat": 46.3394,
    "long": 9.5576
  },
  {
    "zipCode": 7606,
    "city": "Bondo",
    "lat": 46.3354,
    "long": 9.5541
  },
  {
    "zipCode": 7608,
    "city": "Castasegna",
    "lat": 46.3339,
    "long": 9.5179
  },
  {
    "zipCode": 7610,
    "city": "Soglio",
    "lat": 46.342,
    "long": 9.5393
  },
  {
    "zipCode": 7710,
    "city": "Alp Grüm",
    "lat": 46.3746,
    "long": 10.0313
  },
  {
    "zipCode": 7710,
    "city": "Ospizio Bernina",
    "lat": 46.4115,
    "long": 10.0219
  },
  {
    "zipCode": 7741,
    "city": "S. Carlo (Poschiavo)",
    "lat": 46.343,
    "long": 10.0614
  },
  {
    "zipCode": 7742,
    "city": "Sfazù",
    "lat": 46.389,
    "long": 10.081
  },
  {
    "zipCode": 7742,
    "city": "La Rösa",
    "lat": 46.4011,
    "long": 10.0669
  },
  {
    "zipCode": 7742,
    "city": "Poschiavo",
    "lat": 46.3244,
    "long": 10.0582
  },
  {
    "zipCode": 7743,
    "city": "Miralago",
    "lat": 46.2732,
    "long": 10.1007
  },
  {
    "zipCode": 7743,
    "city": "Brusio",
    "lat": 46.2595,
    "long": 10.1238
  },
  {
    "zipCode": 7744,
    "city": "Campocologno",
    "lat": 46.2325,
    "long": 10.1427
  },
  {
    "zipCode": 7745,
    "city": "Li Curt",
    "lat": 46.3099,
    "long": 10.0625
  },
  {
    "zipCode": 7746,
    "city": "Le Prese",
    "lat": 46.2931,
    "long": 10.0789
  },
  {
    "zipCode": 7747,
    "city": "Viano",
    "lat": 46.2533,
    "long": 10.1394
  },
  {
    "zipCode": 7748,
    "city": "Campascio",
    "lat": 46.247,
    "long": 10.1294
  },
  {
    "zipCode": 8000,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8001,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8002,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8003,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8004,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8005,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8006,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8008,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8010,
    "city": "Zürich",
    "lat": 47.395,
    "long": 8.4488
  },
  {
    "zipCode": 8012,
    "city": "Zürich",
    "lat": 47.395,
    "long": 8.4488
  },
  {
    "zipCode": 8021,
    "city": "Zürich 1",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8022,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8024,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8027,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8031,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8032,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8034,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8036,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8037,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8038,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8040,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8041,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8042,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8044,
    "city": "Gockhausen",
    "lat": 47.381,
    "long": 8.5998
  },
  {
    "zipCode": 8044,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8045,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8046,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8047,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8048,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8049,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8050,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8051,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8052,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8053,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8055,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8057,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8058,
    "city": "Zürich",
    "lat": 47.458,
    "long": 8.5853
  },
  {
    "zipCode": 8060,
    "city": "Zürich",
    "lat": 47.458,
    "long": 8.5853
  },
  {
    "zipCode": 8063,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8064,
    "city": "Zürich",
    "lat": 47.3667,
    "long": 8.55
  },
  {
    "zipCode": 8070,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8071,
    "city": "Zürich CS PZ",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8074,
    "city": "Zürich Voice Pub",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8075,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8080,
    "city": "Zürich 80",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8081,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8085,
    "city": "Zürich Versich.",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8086,
    "city": "Zürich R Digest",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8087,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8088,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8090,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8091,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8092,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8093,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8096,
    "city": "Zürich IBRS local",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8098,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8099,
    "city": "Zürich",
    "lat": 47.3828,
    "long": 8.5307
  },
  {
    "zipCode": 8102,
    "city": "Oberengstringen",
    "lat": 47.4084,
    "long": 8.4651
  },
  {
    "zipCode": 8103,
    "city": "Unterengstringen",
    "lat": 47.414,
    "long": 8.4476
  },
  {
    "zipCode": 8104,
    "city": "Weiningen ZH",
    "lat": 47.4202,
    "long": 8.4364
  },
  {
    "zipCode": 8105,
    "city": "Regensdorf",
    "lat": 47.4341,
    "long": 8.4687
  },
  {
    "zipCode": 8105,
    "city": "Watt",
    "lat": 47.4486,
    "long": 8.4853
  },
  {
    "zipCode": 8106,
    "city": "Adlikon b. Regensdorf",
    "lat": 47.4468,
    "long": 8.4664
  },
  {
    "zipCode": 8107,
    "city": "Buchs ZH",
    "lat": 47.4588,
    "long": 8.4366
  },
  {
    "zipCode": 8108,
    "city": "Dällikon",
    "lat": 47.4397,
    "long": 8.44
  },
  {
    "zipCode": 8109,
    "city": "Kloster Fahr",
    "lat": 47.4473,
    "long": 8.3637
  },
  {
    "zipCode": 8112,
    "city": "Otelfingen",
    "lat": 47.4605,
    "long": 8.3914
  },
  {
    "zipCode": 8113,
    "city": "Boppelsen",
    "lat": 47.4695,
    "long": 8.4061
  },
  {
    "zipCode": 8114,
    "city": "Dänikon ZH",
    "lat": 47.4467,
    "long": 8.4065
  },
  {
    "zipCode": 8115,
    "city": "Hüttikon",
    "lat": 47.4426,
    "long": 8.3881
  },
  {
    "zipCode": 8117,
    "city": "Fällanden",
    "lat": 47.3717,
    "long": 8.6387
  },
  {
    "zipCode": 8118,
    "city": "Pfaffhausen",
    "lat": 47.3648,
    "long": 8.6238
  },
  {
    "zipCode": 8121,
    "city": "Benglen",
    "lat": 47.3608,
    "long": 8.6369
  },
  {
    "zipCode": 8122,
    "city": "Binz",
    "lat": 47.3563,
    "long": 8.6266
  },
  {
    "zipCode": 8123,
    "city": "Ebmatingen",
    "lat": 47.3499,
    "long": 8.6401
  },
  {
    "zipCode": 8124,
    "city": "Maur",
    "lat": 47.34,
    "long": 8.6678
  },
  {
    "zipCode": 8125,
    "city": "Zollikerberg",
    "lat": 47.3451,
    "long": 8.6009
  },
  {
    "zipCode": 8126,
    "city": "Zumikon",
    "lat": 47.3316,
    "long": 8.6227
  },
  {
    "zipCode": 8127,
    "city": "Forch",
    "lat": 47.3252,
    "long": 8.6434
  },
  {
    "zipCode": 8132,
    "city": "Hinteregg",
    "lat": 47.3074,
    "long": 8.6834
  },
  {
    "zipCode": 8132,
    "city": "Egg b. Zürich",
    "lat": 47.3074,
    "long": 8.6834
  },
  {
    "zipCode": 8133,
    "city": "Esslingen",
    "lat": 47.2833,
    "long": 8.7104
  },
  {
    "zipCode": 8134,
    "city": "Adliswil",
    "lat": 47.31,
    "long": 8.5246
  },
  {
    "zipCode": 8135,
    "city": "Langnau am Albis",
    "lat": 47.2889,
    "long": 8.5411
  },
  {
    "zipCode": 8135,
    "city": "Sihlbrugg Station",
    "lat": 47.2389,
    "long": 8.5772
  },
  {
    "zipCode": 8135,
    "city": "Sihlwald",
    "lat": 47.269,
    "long": 8.5572
  },
  {
    "zipCode": 8136,
    "city": "Gattikon",
    "lat": 47.2844,
    "long": 8.5483
  },
  {
    "zipCode": 8142,
    "city": "Uitikon Waldegg",
    "lat": 47.3691,
    "long": 8.457
  },
  {
    "zipCode": 8143,
    "city": "Uetliberg",
    "lat": 47.3521,
    "long": 8.4875
  },
  {
    "zipCode": 8143,
    "city": "Stallikon",
    "lat": 47.3258,
    "long": 8.4897
  },
  {
    "zipCode": 8152,
    "city": "Opfikon",
    "lat": 47.4317,
    "long": 8.5759
  },
  {
    "zipCode": 8152,
    "city": "Glattpark (Opfikon)",
    "lat": 47.4315,
    "long": 8.5693
  },
  {
    "zipCode": 8152,
    "city": "Glattbrugg",
    "lat": 47.4313,
    "long": 8.5627
  },
  {
    "zipCode": 8153,
    "city": "Rümlang",
    "lat": 47.4504,
    "long": 8.5299
  },
  {
    "zipCode": 8154,
    "city": "Oberglatt ZH",
    "lat": 47.4758,
    "long": 8.519
  },
  {
    "zipCode": 8155,
    "city": "Niederhasli",
    "lat": 47.4801,
    "long": 8.4858
  },
  {
    "zipCode": 8155,
    "city": "Nassenwil",
    "lat": 47.4668,
    "long": 8.469
  },
  {
    "zipCode": 8156,
    "city": "Oberhasli",
    "lat": 47.4657,
    "long": 8.4988
  },
  {
    "zipCode": 8157,
    "city": "Dielsdorf",
    "lat": 47.4815,
    "long": 8.4585
  },
  {
    "zipCode": 8158,
    "city": "Regensberg",
    "lat": 47.483,
    "long": 8.4379
  },
  {
    "zipCode": 8162,
    "city": "Sünikon",
    "lat": 47.4904,
    "long": 8.4369
  },
  {
    "zipCode": 8162,
    "city": "Steinmaur",
    "lat": 47.4971,
    "long": 8.4522
  },
  {
    "zipCode": 8164,
    "city": "Bachs",
    "lat": 47.5239,
    "long": 8.4394
  },
  {
    "zipCode": 8165,
    "city": "Schöfflisdorf",
    "lat": 47.5003,
    "long": 8.4175
  },
  {
    "zipCode": 8165,
    "city": "Oberweningen",
    "lat": 47.5023,
    "long": 8.407
  },
  {
    "zipCode": 8165,
    "city": "Schleinikon",
    "lat": 47.4975,
    "long": 8.3975
  },
  {
    "zipCode": 8166,
    "city": "Niederweningen",
    "lat": 47.5061,
    "long": 8.3771
  },
  {
    "zipCode": 8172,
    "city": "Niederglatt ZH",
    "lat": 47.4907,
    "long": 8.4999
  },
  {
    "zipCode": 8173,
    "city": "Neerach",
    "lat": 47.511,
    "long": 8.471
  },
  {
    "zipCode": 8174,
    "city": "Stadel b. Niederglatt",
    "lat": 47.5294,
    "long": 8.4635
  },
  {
    "zipCode": 8175,
    "city": "Windlach",
    "lat": 47.5409,
    "long": 8.4738
  },
  {
    "zipCode": 8180,
    "city": "Bülach",
    "lat": 47.522,
    "long": 8.5405
  },
  {
    "zipCode": 8181,
    "city": "Höri",
    "lat": 47.5075,
    "long": 8.5024
  },
  {
    "zipCode": 8182,
    "city": "Hochfelden",
    "lat": 47.5226,
    "long": 8.5156
  },
  {
    "zipCode": 8184,
    "city": "Bachenbülach",
    "lat": 47.5032,
    "long": 8.5456
  },
  {
    "zipCode": 8185,
    "city": "Winkel",
    "lat": 47.4919,
    "long": 8.5537
  },
  {
    "zipCode": 8187,
    "city": "Weiach",
    "lat": 47.5591,
    "long": 8.4334
  },
  {
    "zipCode": 8192,
    "city": "Glattfelden",
    "lat": 47.5587,
    "long": 8.5017
  },
  {
    "zipCode": 8192,
    "city": "Zweidlen",
    "lat": 47.5587,
    "long": 8.5017
  },
  {
    "zipCode": 8193,
    "city": "Eglisau",
    "lat": 47.5774,
    "long": 8.5212
  },
  {
    "zipCode": 8194,
    "city": "Hüntwangen",
    "lat": 47.5958,
    "long": 8.4912
  },
  {
    "zipCode": 8195,
    "city": "Wasterkingen",
    "lat": 47.5896,
    "long": 8.4712
  },
  {
    "zipCode": 8196,
    "city": "Wil ZH",
    "lat": 47.6045,
    "long": 8.5081
  },
  {
    "zipCode": 8197,
    "city": "Rafz",
    "lat": 47.6044,
    "long": 8.543
  },
  {
    "zipCode": 8200,
    "city": "Schaffhouse",
    "lat": 47.6973,
    "long": 8.6349
  },
  {
    "zipCode": 8201,
    "city": "Schaffhausen",
    "lat": 47.7214,
    "long": 8.6247
  },
  {
    "zipCode": 8203,
    "city": "Schaffhausen",
    "lat": 47.6973,
    "long": 8.6349
  },
  {
    "zipCode": 8207,
    "city": "Schaffhausen",
    "lat": 47.6973,
    "long": 8.6349
  },
  {
    "zipCode": 8208,
    "city": "Schaffhausen",
    "lat": 47.6973,
    "long": 8.6349
  },
  {
    "zipCode": 8212,
    "city": "Neuhausen am Rheinfall",
    "lat": 47.6858,
    "long": 8.6147
  },
  {
    "zipCode": 8212,
    "city": "Nohl",
    "lat": 47.6695,
    "long": 8.6079
  },
  {
    "zipCode": 8213,
    "city": "Neunkirch",
    "lat": 47.6901,
    "long": 8.4998
  },
  {
    "zipCode": 8214,
    "city": "Gächlingen",
    "lat": 47.7033,
    "long": 8.4988
  },
  {
    "zipCode": 8215,
    "city": "Hallau",
    "lat": 47.6965,
    "long": 8.4583
  },
  {
    "zipCode": 8216,
    "city": "Oberhallau",
    "lat": 47.7071,
    "long": 8.4785
  },
  {
    "zipCode": 8217,
    "city": "Wilchingen",
    "lat": 47.6675,
    "long": 8.4677
  },
  {
    "zipCode": 8218,
    "city": "Osterfingen",
    "lat": 47.6631,
    "long": 8.4856
  },
  {
    "zipCode": 8219,
    "city": "Trasadingen",
    "lat": 47.6686,
    "long": 8.4299
  },
  {
    "zipCode": 8222,
    "city": "Beringen",
    "lat": 47.6976,
    "long": 8.5743
  },
  {
    "zipCode": 8223,
    "city": "Guntmadingen",
    "lat": 47.713,
    "long": 8.6019
  },
  {
    "zipCode": 8224,
    "city": "Löhningen",
    "lat": 47.7012,
    "long": 8.5524
  },
  {
    "zipCode": 8225,
    "city": "Siblingen",
    "lat": 47.7144,
    "long": 8.5201
  },
  {
    "zipCode": 8226,
    "city": "Schleitheim",
    "lat": 47.7482,
    "long": 8.4821
  },
  {
    "zipCode": 8228,
    "city": "Beggingen",
    "lat": 47.7674,
    "long": 8.5353
  },
  {
    "zipCode": 8231,
    "city": "Hemmental",
    "lat": 47.7338,
    "long": 8.5853
  },
  {
    "zipCode": 8232,
    "city": "Merishausen",
    "lat": 47.7601,
    "long": 8.6105
  },
  {
    "zipCode": 8233,
    "city": "Bargen SH",
    "lat": 47.7919,
    "long": 8.6102
  },
  {
    "zipCode": 8234,
    "city": "Stetten SH",
    "lat": 47.7402,
    "long": 8.663
  },
  {
    "zipCode": 8235,
    "city": "Lohn SH",
    "lat": 47.7551,
    "long": 8.6685
  },
  {
    "zipCode": 8236,
    "city": "Büttenhardt",
    "lat": 47.7571,
    "long": 8.6533
  },
  {
    "zipCode": 8236,
    "city": "Opfertshofen SH",
    "lat": 47.7768,
    "long": 8.662
  },
  {
    "zipCode": 8239,
    "city": "Dörflingen",
    "lat": 47.706,
    "long": 8.7224
  },
  {
    "zipCode": 8240,
    "city": "Thayngen",
    "lat": 47.7472,
    "long": 8.7072
  },
  {
    "zipCode": 8241,
    "city": "Barzheim",
    "lat": 47.7605,
    "long": 8.7213
  },
  {
    "zipCode": 8242,
    "city": "Hofen SH",
    "lat": 47.7818,
    "long": 8.678
  },
  {
    "zipCode": 8242,
    "city": "Bibern SH",
    "lat": 47.7729,
    "long": 8.6762
  },
  {
    "zipCode": 8243,
    "city": "Altdorf SH",
    "lat": 47.7842,
    "long": 8.6595
  },
  {
    "zipCode": 8245,
    "city": "Feuerthalen",
    "lat": 47.6905,
    "long": 8.6436
  },
  {
    "zipCode": 8246,
    "city": "Langwiesen",
    "lat": 47.684,
    "long": 8.6609
  },
  {
    "zipCode": 8247,
    "city": "Flurlingen",
    "lat": 47.6839,
    "long": 8.6299
  },
  {
    "zipCode": 8248,
    "city": "Uhwiesen",
    "lat": 47.6707,
    "long": 8.6354
  },
  {
    "zipCode": 8252,
    "city": "Schlatt TG",
    "lat": 47.6613,
    "long": 8.7033
  },
  {
    "zipCode": 8253,
    "city": "Diessenhofen",
    "lat": 47.6891,
    "long": 8.7496
  },
  {
    "zipCode": 8253,
    "city": "Willisdorf",
    "lat": 47.6813,
    "long": 8.7381
  },
  {
    "zipCode": 8254,
    "city": "Basadingen",
    "lat": 47.6687,
    "long": 8.7482
  },
  {
    "zipCode": 8255,
    "city": "Schlattingen",
    "lat": 47.6656,
    "long": 8.7698
  },
  {
    "zipCode": 8259,
    "city": "Kaltenbach",
    "lat": 47.6518,
    "long": 8.8394
  },
  {
    "zipCode": 8259,
    "city": "Etzwilen",
    "lat": 47.6603,
    "long": 8.8179
  },
  {
    "zipCode": 8259,
    "city": "Wagenhausen",
    "lat": 47.66,
    "long": 8.8478
  },
  {
    "zipCode": 8259,
    "city": "Rheinklingen",
    "lat": 47.6764,
    "long": 8.8086
  },
  {
    "zipCode": 8260,
    "city": "Stein am Rhein",
    "lat": 47.6593,
    "long": 8.8596
  },
  {
    "zipCode": 8261,
    "city": "Hemishofen",
    "lat": 47.6766,
    "long": 8.8298
  },
  {
    "zipCode": 8262,
    "city": "Ramsen",
    "lat": 47.708,
    "long": 8.8095
  },
  {
    "zipCode": 8263,
    "city": "Buch SH",
    "lat": 47.7174,
    "long": 8.7815
  },
  {
    "zipCode": 8264,
    "city": "Eschenz",
    "lat": 47.6479,
    "long": 8.8747
  },
  {
    "zipCode": 8265,
    "city": "Mammern",
    "lat": 47.6463,
    "long": 8.9152
  },
  {
    "zipCode": 8266,
    "city": "Steckborn",
    "lat": 47.6667,
    "long": 8.9833
  },
  {
    "zipCode": 8267,
    "city": "Berlingen",
    "lat": 47.6739,
    "long": 9.0197
  },
  {
    "zipCode": 8268,
    "city": "Salenstein",
    "lat": 47.6687,
    "long": 9.0588
  },
  {
    "zipCode": 8268,
    "city": "Mannenbach-Salenstein",
    "lat": 47.6727,
    "long": 9.0535
  },
  {
    "zipCode": 8269,
    "city": "Fruthwilen",
    "lat": 47.6617,
    "long": 9.0674
  },
  {
    "zipCode": 8272,
    "city": "Ermatingen",
    "lat": 47.6706,
    "long": 9.0857
  },
  {
    "zipCode": 8273,
    "city": "Triboltingen",
    "lat": 47.6621,
    "long": 9.1118
  },
  {
    "zipCode": 8274,
    "city": "Gottlieben",
    "lat": 47.6645,
    "long": 9.1274
  },
  {
    "zipCode": 8274,
    "city": "Tägerwilen",
    "lat": 47.657,
    "long": 9.14
  },
  {
    "zipCode": 8280,
    "city": "Kreuzlingen",
    "lat": 47.6505,
    "long": 9.175
  },
  {
    "zipCode": 8285,
    "city": "Kreuzlingen Ifolor",
    "lat": 47.6398,
    "long": 9.1727
  },
  {
    "zipCode": 8302,
    "city": "Kloten",
    "lat": 47.4515,
    "long": 8.5849
  },
  {
    "zipCode": 8303,
    "city": "Bassersdorf",
    "lat": 47.4434,
    "long": 8.6285
  },
  {
    "zipCode": 8304,
    "city": "Wallisellen",
    "lat": 47.415,
    "long": 8.5967
  },
  {
    "zipCode": 8305,
    "city": "Dietlikon",
    "lat": 47.4183,
    "long": 8.6188
  },
  {
    "zipCode": 8306,
    "city": "Brüttisellen",
    "lat": 47.4217,
    "long": 8.6326
  },
  {
    "zipCode": 8307,
    "city": "Effretikon",
    "lat": 47.4258,
    "long": 8.6909
  },
  {
    "zipCode": 8307,
    "city": "Ottikon b. Kemptthal",
    "lat": 47.4258,
    "long": 8.6909
  },
  {
    "zipCode": 8308,
    "city": "Agasul",
    "lat": 47.4258,
    "long": 8.7408
  },
  {
    "zipCode": 8308,
    "city": "Illnau",
    "lat": 47.4113,
    "long": 8.7213
  },
  {
    "zipCode": 8309,
    "city": "Nürensdorf",
    "lat": 47.4481,
    "long": 8.6491
  },
  {
    "zipCode": 8310,
    "city": "Grafstal",
    "lat": 47.4434,
    "long": 8.6996
  },
  {
    "zipCode": 8310,
    "city": "Kemptthal",
    "lat": 47.4472,
    "long": 8.7044
  },
  {
    "zipCode": 8311,
    "city": "Brütten",
    "lat": 47.4732,
    "long": 8.6757
  },
  {
    "zipCode": 8312,
    "city": "Winterberg ZH",
    "lat": 47.4565,
    "long": 8.6943
  },
  {
    "zipCode": 8314,
    "city": "Kyburg",
    "lat": 47.4557,
    "long": 8.7448
  },
  {
    "zipCode": 8315,
    "city": "Lindau",
    "lat": 47.443,
    "long": 8.6736
  },
  {
    "zipCode": 8317,
    "city": "Tagelswangen",
    "lat": 47.4307,
    "long": 8.6728
  },
  {
    "zipCode": 8320,
    "city": "Fehraltorf",
    "lat": 47.3878,
    "long": 8.7515
  },
  {
    "zipCode": 8322,
    "city": "Gündisau",
    "lat": 47.3984,
    "long": 8.8084
  },
  {
    "zipCode": 8322,
    "city": "Madetswil",
    "lat": 47.4107,
    "long": 8.792
  },
  {
    "zipCode": 8330,
    "city": "Pfäffikon ZH",
    "lat": 47.3645,
    "long": 8.792
  },
  {
    "zipCode": 8331,
    "city": "Auslikon",
    "lat": 47.3443,
    "long": 8.8065
  },
  {
    "zipCode": 8332,
    "city": "Rumlikon",
    "lat": 47.4078,
    "long": 8.7616
  },
  {
    "zipCode": 8332,
    "city": "Russikon",
    "lat": 47.3967,
    "long": 8.7751
  },
  {
    "zipCode": 8335,
    "city": "Hittnau",
    "lat": 47.3633,
    "long": 8.8242
  },
  {
    "zipCode": 8340,
    "city": "Hinwil",
    "lat": 47.2943,
    "long": 8.8439
  },
  {
    "zipCode": 8342,
    "city": "Wernetshausen",
    "lat": 47.2991,
    "long": 8.8646
  },
  {
    "zipCode": 8344,
    "city": "Bäretswil",
    "lat": 47.3371,
    "long": 8.8564
  },
  {
    "zipCode": 8345,
    "city": "Adetswil",
    "lat": 47.3397,
    "long": 8.84
  },
  {
    "zipCode": 8352,
    "city": "Ricketwil (Winterthur)",
    "lat": 47.4869,
    "long": 8.8006
  },
  {
    "zipCode": 8352,
    "city": "Elsau",
    "lat": 47.5026,
    "long": 8.8079
  },
  {
    "zipCode": 8353,
    "city": "Elgg",
    "lat": 47.4972,
    "long": 8.8652
  },
  {
    "zipCode": 8354,
    "city": "Hofstetten ZH",
    "lat": 47.4724,
    "long": 8.854
  },
  {
    "zipCode": 8355,
    "city": "Aadorf",
    "lat": 47.492,
    "long": 8.901
  },
  {
    "zipCode": 8356,
    "city": "Ettenhausen TG",
    "lat": 47.479,
    "long": 8.9008
  },
  {
    "zipCode": 8357,
    "city": "Guntershausen b. Aadorf",
    "lat": 47.4755,
    "long": 8.9182
  },
  {
    "zipCode": 8360,
    "city": "Wallenwil",
    "lat": 47.4582,
    "long": 8.9577
  },
  {
    "zipCode": 8360,
    "city": "Eschlikon TG",
    "lat": 47.4636,
    "long": 8.9638
  },
  {
    "zipCode": 8362,
    "city": "Balterswil",
    "lat": 47.4541,
    "long": 8.9367
  },
  {
    "zipCode": 8363,
    "city": "Bichelsee",
    "lat": 47.449,
    "long": 8.9243
  },
  {
    "zipCode": 8370,
    "city": "Sirnach",
    "lat": 47.4622,
    "long": 8.9976
  },
  {
    "zipCode": 8371,
    "city": "Busswil TG",
    "lat": 47.4503,
    "long": 9.0156
  },
  {
    "zipCode": 8372,
    "city": "Wiezikon b. Sirnach",
    "lat": 47.4513,
    "long": 8.9875
  },
  {
    "zipCode": 8374,
    "city": "Oberwangen TG",
    "lat": 47.4286,
    "long": 8.9679
  },
  {
    "zipCode": 8374,
    "city": "Dussnang",
    "lat": 47.4314,
    "long": 8.9631
  },
  {
    "zipCode": 8376,
    "city": "Au TG",
    "lat": 47.3984,
    "long": 8.9542
  },
  {
    "zipCode": 8376,
    "city": "Fischingen",
    "lat": 47.4142,
    "long": 8.9686
  },
  {
    "zipCode": 8400,
    "city": "Winterthur",
    "lat": 47.5056,
    "long": 8.7241
  },
  {
    "zipCode": 8401,
    "city": "Winterthur",
    "lat": 47.4967,
    "long": 8.7342
  },
  {
    "zipCode": 8403,
    "city": "Winterthur",
    "lat": 47.4967,
    "long": 8.7342
  },
  {
    "zipCode": 8404,
    "city": "Stadel (Winterthur)",
    "lat": 47.5344,
    "long": 8.7628
  },
  {
    "zipCode": 8404,
    "city": "Winterthur",
    "lat": 47.5056,
    "long": 8.7241
  },
  {
    "zipCode": 8404,
    "city": "Reutlingen (Winterthur)",
    "lat": 47.5281,
    "long": 8.7484
  },
  {
    "zipCode": 8405,
    "city": "Winterthur",
    "lat": 47.5056,
    "long": 8.7241
  },
  {
    "zipCode": 8406,
    "city": "Winterthur",
    "lat": 47.5056,
    "long": 8.7241
  },
  {
    "zipCode": 8408,
    "city": "Winterthur",
    "lat": 47.5056,
    "long": 8.7241
  },
  {
    "zipCode": 8409,
    "city": "Winterthur",
    "lat": 47.5056,
    "long": 8.7241
  },
  {
    "zipCode": 8412,
    "city": "Hünikon (Neftenbach)",
    "lat": 47.552,
    "long": 8.6678
  },
  {
    "zipCode": 8412,
    "city": "Aesch (Neftenbach)",
    "lat": 47.5411,
    "long": 8.6796
  },
  {
    "zipCode": 8412,
    "city": "Riet (Neftenbach)",
    "lat": 47.5369,
    "long": 8.6885
  },
  {
    "zipCode": 8413,
    "city": "Neftenbach",
    "lat": 47.5276,
    "long": 8.6649
  },
  {
    "zipCode": 8414,
    "city": "Buch am Irchel",
    "lat": 47.55,
    "long": 8.6333
  },
  {
    "zipCode": 8415,
    "city": "Gräslikon",
    "lat": 47.5566,
    "long": 8.6054
  },
  {
    "zipCode": 8415,
    "city": "Berg am Irchel",
    "lat": 47.5695,
    "long": 8.5968
  },
  {
    "zipCode": 8416,
    "city": "Flaach",
    "lat": 47.5761,
    "long": 8.6063
  },
  {
    "zipCode": 8418,
    "city": "Schlatt ZH",
    "lat": 47.4667,
    "long": 8.8282
  },
  {
    "zipCode": 8421,
    "city": "Dättlikon",
    "lat": 47.5249,
    "long": 8.6245
  },
  {
    "zipCode": 8422,
    "city": "Pfungen",
    "lat": 47.5139,
    "long": 8.6423
  },
  {
    "zipCode": 8424,
    "city": "Embrach",
    "lat": 47.5056,
    "long": 8.5941
  },
  {
    "zipCode": 8425,
    "city": "Oberembrach",
    "lat": 47.4878,
    "long": 8.6183
  },
  {
    "zipCode": 8426,
    "city": "Lufingen",
    "lat": 47.4911,
    "long": 8.5943
  },
  {
    "zipCode": 8427,
    "city": "Rorbas",
    "lat": 47.5309,
    "long": 8.5756
  },
  {
    "zipCode": 8427,
    "city": "Freienstein",
    "lat": 47.5331,
    "long": 8.5845
  },
  {
    "zipCode": 8428,
    "city": "Teufen ZH",
    "lat": 47.5512,
    "long": 8.5657
  },
  {
    "zipCode": 8442,
    "city": "Hettlingen",
    "lat": 47.5461,
    "long": 8.7053
  },
  {
    "zipCode": 8444,
    "city": "Henggart",
    "lat": 47.5627,
    "long": 8.6821
  },
  {
    "zipCode": 8447,
    "city": "Dachsen",
    "lat": 47.6652,
    "long": 8.6179
  },
  {
    "zipCode": 8450,
    "city": "Andelfingen",
    "lat": 47.5945,
    "long": 8.6783
  },
  {
    "zipCode": 8451,
    "city": "Kleinandelfingen",
    "lat": 47.6006,
    "long": 8.6836
  },
  {
    "zipCode": 8452,
    "city": "Adlikon b. Andelfingen",
    "lat": 47.5823,
    "long": 8.6915
  },
  {
    "zipCode": 8453,
    "city": "Alten",
    "lat": 47.5989,
    "long": 8.6437
  },
  {
    "zipCode": 8454,
    "city": "Buchberg",
    "lat": 47.5728,
    "long": 8.5628
  },
  {
    "zipCode": 8455,
    "city": "Rüdlingen",
    "lat": 47.5783,
    "long": 8.5719
  },
  {
    "zipCode": 8457,
    "city": "Humlikon",
    "lat": 47.5764,
    "long": 8.6701
  },
  {
    "zipCode": 8458,
    "city": "Dorf",
    "lat": 47.5729,
    "long": 8.6478
  },
  {
    "zipCode": 8459,
    "city": "Volken",
    "lat": 47.5748,
    "long": 8.6258
  },
  {
    "zipCode": 8460,
    "city": "Marthalen",
    "lat": 47.6291,
    "long": 8.6533
  },
  {
    "zipCode": 8461,
    "city": "Oerlingen",
    "lat": 47.6249,
    "long": 8.6759
  },
  {
    "zipCode": 8462,
    "city": "Rheinau",
    "lat": 47.6328,
    "long": 8.6025
  },
  {
    "zipCode": 8463,
    "city": "Benken ZH",
    "lat": 47.6528,
    "long": 8.6539
  },
  {
    "zipCode": 8464,
    "city": "Ellikon am Rhein",
    "lat": 47.605,
    "long": 8.5992
  },
  {
    "zipCode": 8465,
    "city": "Wildensbuch",
    "lat": 47.6521,
    "long": 8.6766
  },
  {
    "zipCode": 8465,
    "city": "Rudolfingen",
    "lat": 47.6406,
    "long": 8.6743
  },
  {
    "zipCode": 8466,
    "city": "Trüllikon",
    "lat": 47.6354,
    "long": 8.6892
  },
  {
    "zipCode": 8467,
    "city": "Truttikon",
    "lat": 47.6291,
    "long": 8.7272
  },
  {
    "zipCode": 8468,
    "city": "Guntalingen",
    "lat": 47.6324,
    "long": 8.7685
  },
  {
    "zipCode": 8468,
    "city": "Waltalingen",
    "lat": 47.622,
    "long": 8.7782
  },
  {
    "zipCode": 8471,
    "city": "Berg (Dägerlen)",
    "lat": 47.5636,
    "long": 8.7322
  },
  {
    "zipCode": 8471,
    "city": "Bänk (Dägerlen)",
    "lat": 47.5482,
    "long": 8.739
  },
  {
    "zipCode": 8471,
    "city": "Rutschwil (Dägerlen)",
    "lat": 47.5569,
    "long": 8.7313
  },
  {
    "zipCode": 8471,
    "city": "Dägerlen",
    "lat": 47.5607,
    "long": 8.7215
  },
  {
    "zipCode": 8471,
    "city": "Oberwil (Dägerlen)",
    "lat": 47.5736,
    "long": 8.7171
  },
  {
    "zipCode": 8472,
    "city": "Seuzach",
    "lat": 47.5356,
    "long": 8.7321
  },
  {
    "zipCode": 8474,
    "city": "Dinhard",
    "lat": 47.55,
    "long": 8.7667
  },
  {
    "zipCode": 8475,
    "city": "Ossingen",
    "lat": 47.6118,
    "long": 8.7278
  },
  {
    "zipCode": 8476,
    "city": "Unterstammheim",
    "lat": 47.6392,
    "long": 8.7906
  },
  {
    "zipCode": 8477,
    "city": "Oberstammheim",
    "lat": 47.6324,
    "long": 8.7996
  },
  {
    "zipCode": 8478,
    "city": "Thalheim an der Thur",
    "lat": 47.5782,
    "long": 8.7512
  },
  {
    "zipCode": 8479,
    "city": "Altikon",
    "lat": 47.574,
    "long": 8.7828
  },
  {
    "zipCode": 8482,
    "city": "Sennhof (Winterthur)",
    "lat": 47.468,
    "long": 8.7578
  },
  {
    "zipCode": 8483,
    "city": "Kollbrunn",
    "lat": 47.4579,
    "long": 8.7829
  },
  {
    "zipCode": 8484,
    "city": "Theilingen",
    "lat": 47.4208,
    "long": 8.7676
  },
  {
    "zipCode": 8484,
    "city": "Neschwil",
    "lat": 47.4294,
    "long": 8.7888
  },
  {
    "zipCode": 8484,
    "city": "Weisslingen",
    "lat": 47.4306,
    "long": 8.7679
  },
  {
    "zipCode": 8486,
    "city": "Rikon im Tösstal",
    "lat": 47.4459,
    "long": 8.798
  },
  {
    "zipCode": 8487,
    "city": "Rämismühle",
    "lat": 47.4393,
    "long": 8.8217
  },
  {
    "zipCode": 8487,
    "city": "Zell ZH",
    "lat": 47.4461,
    "long": 8.8218
  },
  {
    "zipCode": 8488,
    "city": "Turbenthal",
    "lat": 47.4363,
    "long": 8.8463
  },
  {
    "zipCode": 8489,
    "city": "Schalchen",
    "lat": 47.4073,
    "long": 8.8255
  },
  {
    "zipCode": 8489,
    "city": "Ehrikon",
    "lat": 47.4196,
    "long": 8.8102
  },
  {
    "zipCode": 8489,
    "city": "Wildberg",
    "lat": 47.4259,
    "long": 8.8167
  },
  {
    "zipCode": 8492,
    "city": "Wila",
    "lat": 47.4193,
    "long": 8.8452
  },
  {
    "zipCode": 8493,
    "city": "Saland",
    "lat": 47.3907,
    "long": 8.8529
  },
  {
    "zipCode": 8494,
    "city": "Bauma",
    "lat": 47.3674,
    "long": 8.879
  },
  {
    "zipCode": 8495,
    "city": "Schmidrüti",
    "lat": 47.4155,
    "long": 8.9029
  },
  {
    "zipCode": 8496,
    "city": "Steg im Tösstal",
    "lat": 47.3506,
    "long": 8.9342
  },
  {
    "zipCode": 8497,
    "city": "Fischenthal",
    "lat": 47.3312,
    "long": 8.9205
  },
  {
    "zipCode": 8498,
    "city": "Gibswil",
    "lat": 47.3153,
    "long": 8.9141
  },
  {
    "zipCode": 8499,
    "city": "Sternenberg",
    "lat": 47.3833,
    "long": 8.9167
  },
  {
    "zipCode": 8500,
    "city": "Frauenfeld",
    "lat": 47.5578,
    "long": 8.8989
  },
  {
    "zipCode": 8501,
    "city": "Frauenfeld",
    "lat": 47.558,
    "long": 8.8964
  },
  {
    "zipCode": 8502,
    "city": "Frauenfeld",
    "lat": 47.558,
    "long": 8.8964
  },
  {
    "zipCode": 8503,
    "city": "Frauenfeld",
    "lat": 47.558,
    "long": 8.8964
  },
  {
    "zipCode": 8505,
    "city": "Pfyn",
    "lat": 47.5969,
    "long": 8.9542
  },
  {
    "zipCode": 8505,
    "city": "Dettighofen",
    "lat": 47.6181,
    "long": 8.9503
  },
  {
    "zipCode": 8506,
    "city": "Lanzenneunforn",
    "lat": 47.624,
    "long": 8.9401
  },
  {
    "zipCode": 8507,
    "city": "Hörhausen",
    "lat": 47.632,
    "long": 8.9695
  },
  {
    "zipCode": 8508,
    "city": "Homburg",
    "lat": 47.6347,
    "long": 9.0076
  },
  {
    "zipCode": 8509,
    "city": "Frauenfeld",
    "lat": 47.558,
    "long": 8.8964
  },
  {
    "zipCode": 8510,
    "city": "Frauenfeld",
    "lat": 47.558,
    "long": 8.8964
  },
  {
    "zipCode": 8512,
    "city": "Lustdorf",
    "lat": 47.5514,
    "long": 8.9881
  },
  {
    "zipCode": 8512,
    "city": "Wetzikon TG",
    "lat": 47.538,
    "long": 9.0002
  },
  {
    "zipCode": 8512,
    "city": "Thundorf",
    "lat": 47.5459,
    "long": 8.9636
  },
  {
    "zipCode": 8514,
    "city": "Amlikon-Bissegg",
    "lat": 47.5619,
    "long": 9.0353
  },
  {
    "zipCode": 8522,
    "city": "Häuslenen",
    "lat": 47.5277,
    "long": 8.904
  },
  {
    "zipCode": 8522,
    "city": "Aawangen",
    "lat": 47.5133,
    "long": 8.9008
  },
  {
    "zipCode": 8523,
    "city": "Hagenbuch ZH",
    "lat": 47.5204,
    "long": 8.8892
  },
  {
    "zipCode": 8524,
    "city": "Buch b. Frauenfeld",
    "lat": 47.5984,
    "long": 8.8409
  },
  {
    "zipCode": 8524,
    "city": "Uesslingen",
    "lat": 47.5815,
    "long": 8.831
  },
  {
    "zipCode": 8525,
    "city": "Niederneunforn",
    "lat": 47.5973,
    "long": 8.7848
  },
  {
    "zipCode": 8525,
    "city": "Wilen b. Neunforn",
    "lat": 47.5973,
    "long": 8.7848
  },
  {
    "zipCode": 8526,
    "city": "Oberneunforn",
    "lat": 47.6077,
    "long": 8.7713
  },
  {
    "zipCode": 8532,
    "city": "Weiningen TG",
    "lat": 47.585,
    "long": 8.8741
  },
  {
    "zipCode": 8532,
    "city": "Warth",
    "lat": 47.585,
    "long": 8.8741
  },
  {
    "zipCode": 8535,
    "city": "Herdern",
    "lat": 47.603,
    "long": 8.9108
  },
  {
    "zipCode": 8536,
    "city": "Hüttwilen",
    "lat": 47.6067,
    "long": 8.8734
  },
  {
    "zipCode": 8537,
    "city": "Nussbaumen TG",
    "lat": 47.6251,
    "long": 8.828
  },
  {
    "zipCode": 8537,
    "city": "Uerschhausen",
    "lat": 47.6085,
    "long": 8.8181
  },
  {
    "zipCode": 8542,
    "city": "Wiesendangen",
    "lat": 47.5217,
    "long": 8.7897
  },
  {
    "zipCode": 8543,
    "city": "Bertschikon",
    "lat": 47.5273,
    "long": 8.8142
  },
  {
    "zipCode": 8543,
    "city": "Kefikon ZH",
    "lat": 47.5489,
    "long": 8.8307
  },
  {
    "zipCode": 8543,
    "city": "Gundetswil",
    "lat": 47.5407,
    "long": 8.823
  },
  {
    "zipCode": 8544,
    "city": "Attikon",
    "lat": 47.5362,
    "long": 8.7964
  },
  {
    "zipCode": 8545,
    "city": "Rickenbach Sulz",
    "lat": 47.5395,
    "long": 8.7889
  },
  {
    "zipCode": 8545,
    "city": "Rickenbach ZH",
    "lat": 47.5519,
    "long": 8.7965
  },
  {
    "zipCode": 8546,
    "city": "Islikon",
    "lat": 47.546,
    "long": 8.8417
  },
  {
    "zipCode": 8546,
    "city": "Kefikon TG",
    "lat": 47.5477,
    "long": 8.8316
  },
  {
    "zipCode": 8546,
    "city": "Menzengrüt",
    "lat": 47.5494,
    "long": 8.8215
  },
  {
    "zipCode": 8547,
    "city": "Gachnang",
    "lat": 47.5393,
    "long": 8.8531
  },
  {
    "zipCode": 8548,
    "city": "Ellikon an der Thur",
    "lat": 47.563,
    "long": 8.8233
  },
  {
    "zipCode": 8552,
    "city": "Felben-Wellhausen",
    "lat": 47.5791,
    "long": 8.9422
  },
  {
    "zipCode": 8553,
    "city": "Harenwilen",
    "lat": 47.5704,
    "long": 9.0004
  },
  {
    "zipCode": 8553,
    "city": "Eschikofen",
    "lat": 47.5805,
    "long": 9.0055
  },
  {
    "zipCode": 8553,
    "city": "Mettendorf TG",
    "lat": 47.578,
    "long": 8.9808
  },
  {
    "zipCode": 8553,
    "city": "Hüttlingen",
    "lat": 47.578,
    "long": 8.9808
  },
  {
    "zipCode": 8554,
    "city": "Müllheim-Wigoltingen",
    "lat": 47.5839,
    "long": 9.0456
  },
  {
    "zipCode": 8554,
    "city": "Bonau",
    "lat": 47.5839,
    "long": 9.0456
  },
  {
    "zipCode": 8555,
    "city": "Müllheim Dorf",
    "lat": 47.6019,
    "long": 9.0036
  },
  {
    "zipCode": 8556,
    "city": "Engwang",
    "lat": 47.6015,
    "long": 9.0555
  },
  {
    "zipCode": 8556,
    "city": "Wigoltingen",
    "lat": 47.5977,
    "long": 9.0314
  },
  {
    "zipCode": 8556,
    "city": "Lamperswil TG",
    "lat": 47.6117,
    "long": 9.038
  },
  {
    "zipCode": 8556,
    "city": "Illhart",
    "lat": 47.6213,
    "long": 9.0395
  },
  {
    "zipCode": 8558,
    "city": "Raperswilen",
    "lat": 47.6324,
    "long": 9.0426
  },
  {
    "zipCode": 8560,
    "city": "Märstetten",
    "lat": 47.5925,
    "long": 9.0685
  },
  {
    "zipCode": 8561,
    "city": "Ottoberg",
    "lat": 47.5876,
    "long": 9.0847
  },
  {
    "zipCode": 8564,
    "city": "Engwilen",
    "lat": 47.6185,
    "long": 9.0969
  },
  {
    "zipCode": 8564,
    "city": "Sonterswil",
    "lat": 47.6222,
    "long": 9.0795
  },
  {
    "zipCode": 8564,
    "city": "Gunterswilen",
    "lat": 47.6356,
    "long": 9.0769
  },
  {
    "zipCode": 8564,
    "city": "Lipperswil",
    "lat": 47.617,
    "long": 9.057
  },
  {
    "zipCode": 8564,
    "city": "Hattenhausen",
    "lat": 47.6258,
    "long": 9.068
  },
  {
    "zipCode": 8564,
    "city": "Wäldi",
    "lat": 47.6342,
    "long": 9.095
  },
  {
    "zipCode": 8564,
    "city": "Hefenhausen",
    "lat": 47.6171,
    "long": 9.0649
  },
  {
    "zipCode": 8564,
    "city": "Wagerswil",
    "lat": 47.609,
    "long": 9.0651
  },
  {
    "zipCode": 8565,
    "city": "Hugelshofen",
    "lat": 47.5999,
    "long": 9.1165
  },
  {
    "zipCode": 8566,
    "city": "Neuwilen",
    "lat": 47.6214,
    "long": 9.1354
  },
  {
    "zipCode": 8566,
    "city": "Ellighausen",
    "lat": 47.6149,
    "long": 9.1369
  },
  {
    "zipCode": 8566,
    "city": "Dotnacht",
    "lat": 47.6016,
    "long": 9.1424
  },
  {
    "zipCode": 8566,
    "city": "Lippoldswilen",
    "lat": 47.6123,
    "long": 9.1127
  },
  {
    "zipCode": 8570,
    "city": "Weinfelden",
    "lat": 47.5667,
    "long": 9.1
  },
  {
    "zipCode": 8572,
    "city": "Berg TG",
    "lat": 47.5788,
    "long": 9.1664
  },
  {
    "zipCode": 8572,
    "city": "Andhausen",
    "lat": 47.5794,
    "long": 9.1807
  },
  {
    "zipCode": 8572,
    "city": "Guntershausen b. Berg",
    "lat": 47.5835,
    "long": 9.1743
  },
  {
    "zipCode": 8572,
    "city": "Graltshausen",
    "lat": 47.5972,
    "long": 9.1836
  },
  {
    "zipCode": 8572,
    "city": "Berg TG",
    "lat": 47.5788,
    "long": 9.1664
  },
  {
    "zipCode": 8573,
    "city": "Alterswilen",
    "lat": 47.6096,
    "long": 9.1541
  },
  {
    "zipCode": 8573,
    "city": "Siegershausen",
    "lat": 47.6112,
    "long": 9.1684
  },
  {
    "zipCode": 8573,
    "city": "Altishausen",
    "lat": 47.6026,
    "long": 9.1719
  },
  {
    "zipCode": 8574,
    "city": "Lengwil",
    "lat": 47.6252,
    "long": 9.1924
  },
  {
    "zipCode": 8574,
    "city": "Dettighofen (Lengwil)",
    "lat": 47.6219,
    "long": 9.2016
  },
  {
    "zipCode": 8574,
    "city": "Oberhofen TG",
    "lat": 47.6252,
    "long": 9.1924
  },
  {
    "zipCode": 8574,
    "city": "Illighausen",
    "lat": 47.6031,
    "long": 9.2098
  },
  {
    "zipCode": 8574,
    "city": "Lengwil",
    "lat": 47.6252,
    "long": 9.1924
  },
  {
    "zipCode": 8575,
    "city": "Istighofen",
    "lat": 47.5423,
    "long": 9.1499
  },
  {
    "zipCode": 8575,
    "city": "Bürglen TG",
    "lat": 47.5492,
    "long": 9.1495
  },
  {
    "zipCode": 8576,
    "city": "Mauren TG",
    "lat": 47.5675,
    "long": 9.1566
  },
  {
    "zipCode": 8577,
    "city": "Schönholzerswilen",
    "lat": 47.517,
    "long": 9.1409
  },
  {
    "zipCode": 8580,
    "city": "Amriswil",
    "lat": 47.547,
    "long": 9.2959
  },
  {
    "zipCode": 8581,
    "city": "Schocherswil",
    "lat": 47.5381,
    "long": 9.2674
  },
  {
    "zipCode": 8582,
    "city": "Dozwil",
    "lat": 47.576,
    "long": 9.319
  },
  {
    "zipCode": 8583,
    "city": "Sulgen",
    "lat": 47.5397,
    "long": 9.1859
  },
  {
    "zipCode": 8583,
    "city": "Götighofen",
    "lat": 47.536,
    "long": 9.2173
  },
  {
    "zipCode": 8583,
    "city": "Donzhausen",
    "lat": 47.5555,
    "long": 9.1974
  },
  {
    "zipCode": 8584,
    "city": "Leimbach TG",
    "lat": 47.5611,
    "long": 9.1881
  },
  {
    "zipCode": 8584,
    "city": "Opfershofen TG",
    "lat": 47.5609,
    "long": 9.1753
  },
  {
    "zipCode": 8585,
    "city": "Zuben",
    "lat": 47.6102,
    "long": 9.2379
  },
  {
    "zipCode": 8585,
    "city": "Herrenhof",
    "lat": 47.5971,
    "long": 9.2447
  },
  {
    "zipCode": 8585,
    "city": "Schönenbaumgarten",
    "lat": 47.6139,
    "long": 9.2341
  },
  {
    "zipCode": 8585,
    "city": "Langrickenbach",
    "lat": 47.5935,
    "long": 9.2473
  },
  {
    "zipCode": 8585,
    "city": "Klarsreuti",
    "lat": 47.5887,
    "long": 9.214
  },
  {
    "zipCode": 8585,
    "city": "Happerswil",
    "lat": 47.5791,
    "long": 9.2241
  },
  {
    "zipCode": 8585,
    "city": "Birwinken",
    "lat": 47.5432,
    "long": 9.148
  },
  {
    "zipCode": 8585,
    "city": "Mattwil",
    "lat": 47.5791,
    "long": 9.2077
  },
  {
    "zipCode": 8586,
    "city": "Kümmertshausen",
    "lat": 47.566,
    "long": 9.2416
  },
  {
    "zipCode": 8586,
    "city": "Engishofen",
    "lat": 47.5586,
    "long": 9.2528
  },
  {
    "zipCode": 8586,
    "city": "Andwil TG",
    "lat": 47.5683,
    "long": 9.2171
  },
  {
    "zipCode": 8586,
    "city": "Ennetaach",
    "lat": 47.5504,
    "long": 9.2172
  },
  {
    "zipCode": 8586,
    "city": "Erlen",
    "lat": 47.5481,
    "long": 9.2341
  },
  {
    "zipCode": 8586,
    "city": "Buchackern",
    "lat": 47.5399,
    "long": 9.2339
  },
  {
    "zipCode": 8586,
    "city": "Riedt b. Erlen",
    "lat": 47.5552,
    "long": 9.2328
  },
  {
    "zipCode": 8586,
    "city": "Buch b. Kümmertshausen",
    "lat": 47.5765,
    "long": 9.2148
  },
  {
    "zipCode": 8587,
    "city": "Oberaach",
    "lat": 47.5595,
    "long": 9.2651
  },
  {
    "zipCode": 8588,
    "city": "Zihlschlacht",
    "lat": 47.5207,
    "long": 9.2574
  },
  {
    "zipCode": 8589,
    "city": "Sitterdorf",
    "lat": 47.5026,
    "long": 9.2478
  },
  {
    "zipCode": 8590,
    "city": "Romanshorn",
    "lat": 47.5659,
    "long": 9.3787
  },
  {
    "zipCode": 8592,
    "city": "Uttwil",
    "lat": 47.5844,
    "long": 9.341
  },
  {
    "zipCode": 8593,
    "city": "Kesswil",
    "lat": 47.5935,
    "long": 9.3172
  },
  {
    "zipCode": 8594,
    "city": "Güttingen",
    "lat": 47.6035,
    "long": 9.2874
  },
  {
    "zipCode": 8595,
    "city": "Altnau",
    "lat": 47.6105,
    "long": 9.2616
  },
  {
    "zipCode": 8596,
    "city": "Scherzingen",
    "lat": 47.6312,
    "long": 9.2248
  },
  {
    "zipCode": 8596,
    "city": "Münsterlingen",
    "lat": 47.632,
    "long": 9.2327
  },
  {
    "zipCode": 8597,
    "city": "Landschlacht",
    "lat": 47.6276,
    "long": 9.2455
  },
  {
    "zipCode": 8598,
    "city": "Bottighofen",
    "lat": 47.6364,
    "long": 9.2088
  },
  {
    "zipCode": 8599,
    "city": "Salmsach",
    "lat": 47.5543,
    "long": 9.3723
  },
  {
    "zipCode": 8600,
    "city": "Dübendorf",
    "lat": 47.3972,
    "long": 8.6187
  },
  {
    "zipCode": 8602,
    "city": "Wangen b. Dübendorf",
    "lat": 47.4118,
    "long": 8.6452
  },
  {
    "zipCode": 8603,
    "city": "Schwerzenbach",
    "lat": 47.3821,
    "long": 8.6573
  },
  {
    "zipCode": 8604,
    "city": "Volketswil",
    "lat": 47.3902,
    "long": 8.6909
  },
  {
    "zipCode": 8605,
    "city": "Gutenswil",
    "lat": 47.3839,
    "long": 8.7176
  },
  {
    "zipCode": 8606,
    "city": "Greifensee",
    "lat": 47.3672,
    "long": 8.6811
  },
  {
    "zipCode": 8606,
    "city": "Nänikon",
    "lat": 47.3697,
    "long": 8.6889
  },
  {
    "zipCode": 8607,
    "city": "Aathal-Seegräben",
    "lat": 47.3351,
    "long": 8.77
  },
  {
    "zipCode": 8608,
    "city": "Bubikon",
    "lat": 47.267,
    "long": 8.8179
  },
  {
    "zipCode": 8610,
    "city": "Uster",
    "lat": 47.3471,
    "long": 8.7209
  },
  {
    "zipCode": 8613,
    "city": "Uster 3",
    "lat": 47.3532,
    "long": 8.7216
  },
  {
    "zipCode": 8614,
    "city": "Bertschikon (Gossau ZH)",
    "lat": 47.3281,
    "long": 8.7461
  },
  {
    "zipCode": 8614,
    "city": "Sulzbach",
    "lat": 47.3281,
    "long": 8.7461
  },
  {
    "zipCode": 8615,
    "city": "Freudwil",
    "lat": 47.3757,
    "long": 8.7334
  },
  {
    "zipCode": 8615,
    "city": "Wermatswil",
    "lat": 47.3641,
    "long": 8.7415
  },
  {
    "zipCode": 8616,
    "city": "Riedikon",
    "lat": 47.3317,
    "long": 8.7127
  },
  {
    "zipCode": 8617,
    "city": "Mönchaltorf",
    "lat": 47.3096,
    "long": 8.7203
  },
  {
    "zipCode": 8618,
    "city": "Oetwil am See",
    "lat": 47.2705,
    "long": 8.7202
  },
  {
    "zipCode": 8620,
    "city": "Wetzikon ZH",
    "lat": 47.3264,
    "long": 8.7978
  },
  {
    "zipCode": 8623,
    "city": "Wetzikon ZH",
    "lat": 47.3264,
    "long": 8.7978
  },
  {
    "zipCode": 8624,
    "city": "Grüt (Gossau ZH)",
    "lat": 47.3115,
    "long": 8.7834
  },
  {
    "zipCode": 8625,
    "city": "Gossau ZH",
    "lat": 47.3051,
    "long": 8.7583
  },
  {
    "zipCode": 8626,
    "city": "Ottikon (Gossau ZH)",
    "lat": 47.2946,
    "long": 8.7819
  },
  {
    "zipCode": 8627,
    "city": "Grüningen",
    "lat": 47.2833,
    "long": 8.75
  },
  {
    "zipCode": 8630,
    "city": "Rüti ZH",
    "lat": 47.256,
    "long": 8.8555
  },
  {
    "zipCode": 8632,
    "city": "Tann",
    "lat": 47.269,
    "long": 8.8502
  },
  {
    "zipCode": 8633,
    "city": "Wolfhausen",
    "lat": 47.2562,
    "long": 8.7991
  },
  {
    "zipCode": 8634,
    "city": "Hombrechtikon",
    "lat": 47.253,
    "long": 8.7721
  },
  {
    "zipCode": 8635,
    "city": "Dürnten",
    "lat": 47.2786,
    "long": 8.8416
  },
  {
    "zipCode": 8636,
    "city": "Wald ZH",
    "lat": 47.276,
    "long": 8.914
  },
  {
    "zipCode": 8637,
    "city": "Laupen ZH",
    "lat": 47.265,
    "long": 8.9285
  },
  {
    "zipCode": 8638,
    "city": "Goldingen",
    "lat": 47.2648,
    "long": 8.9617
  },
  {
    "zipCode": 8640,
    "city": "Rapperswil",
    "lat": 47.2256,
    "long": 8.8223
  },
  {
    "zipCode": 8645,
    "city": "Jona",
    "lat": 47.2298,
    "long": 8.8388
  },
  {
    "zipCode": 8646,
    "city": "Wagen",
    "lat": 47.2324,
    "long": 8.8869
  },
  {
    "zipCode": 8700,
    "city": "Küsnacht ZH",
    "lat": 47.3181,
    "long": 8.584
  },
  {
    "zipCode": 8702,
    "city": "Zollikon",
    "lat": 47.3402,
    "long": 8.5741
  },
  {
    "zipCode": 8703,
    "city": "Erlenbach ZH",
    "lat": 47.303,
    "long": 8.5974
  },
  {
    "zipCode": 8704,
    "city": "Herrliberg",
    "lat": 47.2906,
    "long": 8.6146
  },
  {
    "zipCode": 8706,
    "city": "Meilen",
    "lat": 47.2723,
    "long": 8.6462
  },
  {
    "zipCode": 8707,
    "city": "Uetikon am See",
    "lat": 47.2644,
    "long": 8.6792
  },
  {
    "zipCode": 8708,
    "city": "Männedorf",
    "lat": 47.2569,
    "long": 8.6989
  },
  {
    "zipCode": 8712,
    "city": "Stäfa",
    "lat": 47.2425,
    "long": 8.7234
  },
  {
    "zipCode": 8713,
    "city": "Uerikon",
    "lat": 47.2367,
    "long": 8.7573
  },
  {
    "zipCode": 8714,
    "city": "Feldbach",
    "lat": 47.2396,
    "long": 8.7847
  },
  {
    "zipCode": 8715,
    "city": "Bollingen",
    "lat": 47.2205,
    "long": 8.8955
  },
  {
    "zipCode": 8716,
    "city": "Schmerikon",
    "lat": 47.2254,
    "long": 8.9484
  },
  {
    "zipCode": 8717,
    "city": "Benken SG",
    "lat": 47.1994,
    "long": 9.0073
  },
  {
    "zipCode": 8718,
    "city": "Schänis",
    "lat": 47.16,
    "long": 9.0455
  },
  {
    "zipCode": 8722,
    "city": "Kaltbrunn",
    "lat": 47.2137,
    "long": 9.0259
  },
  {
    "zipCode": 8723,
    "city": "Rufi",
    "lat": 47.1801,
    "long": 9.0497
  },
  {
    "zipCode": 8723,
    "city": "Maseltrangen",
    "lat": 47.1915,
    "long": 9.0524
  },
  {
    "zipCode": 8725,
    "city": "Gebertingen",
    "lat": 47.2537,
    "long": 9.0055
  },
  {
    "zipCode": 8725,
    "city": "Ernetschwil",
    "lat": 47.2375,
    "long": 9.0005
  },
  {
    "zipCode": 8726,
    "city": "Ricken SG",
    "lat": 47.2631,
    "long": 9.044
  },
  {
    "zipCode": 8727,
    "city": "Walde SG",
    "lat": 47.2718,
    "long": 9.0122
  },
  {
    "zipCode": 8730,
    "city": "Uznach",
    "lat": 47.2242,
    "long": 8.9826
  },
  {
    "zipCode": 8732,
    "city": "Neuhaus SG",
    "lat": 47.2443,
    "long": 8.9482
  },
  {
    "zipCode": 8733,
    "city": "Eschenbach SG",
    "lat": 47.2398,
    "long": 8.9216
  },
  {
    "zipCode": 8734,
    "city": "Ermenswil",
    "lat": 47.2461,
    "long": 8.8862
  },
  {
    "zipCode": 8735,
    "city": "St. Gallenkappel",
    "lat": 47.2437,
    "long": 8.9644
  },
  {
    "zipCode": 8735,
    "city": "Rüeterswil",
    "lat": 47.2601,
    "long": 8.9901
  },
  {
    "zipCode": 8737,
    "city": "Gommiswald",
    "lat": 47.2313,
    "long": 9.0236
  },
  {
    "zipCode": 8738,
    "city": "Uetliburg SG",
    "lat": 47.2378,
    "long": 9.0356
  },
  {
    "zipCode": 8739,
    "city": "Rieden SG",
    "lat": 47.2228,
    "long": 9.0516
  },
  {
    "zipCode": 8740,
    "city": "Uznach Vögele AG",
    "lat": 47.2265,
    "long": 8.9813
  },
  {
    "zipCode": 8750,
    "city": "Glaris",
    "lat": 47.0406,
    "long": 9.068
  },
  {
    "zipCode": 8751,
    "city": "Urnerboden",
    "lat": 46.8891,
    "long": 8.9015
  },
  {
    "zipCode": 8752,
    "city": "Näfels",
    "lat": 47.0978,
    "long": 9.0636
  },
  {
    "zipCode": 8753,
    "city": "Mollis",
    "lat": 47.0888,
    "long": 9.0724
  },
  {
    "zipCode": 8754,
    "city": "Netstal",
    "lat": 47.0634,
    "long": 9.0573
  },
  {
    "zipCode": 8755,
    "city": "Ennenda",
    "lat": 47.0336,
    "long": 9.0789
  },
  {
    "zipCode": 8756,
    "city": "Mitlödi",
    "lat": 47.0123,
    "long": 9.0802
  },
  {
    "zipCode": 8757,
    "city": "Filzbach",
    "lat": 47.119,
    "long": 9.1324
  },
  {
    "zipCode": 8758,
    "city": "Obstalden",
    "lat": 47.1173,
    "long": 9.1487
  },
  {
    "zipCode": 8759,
    "city": "Netstal",
    "lat": 47.021,
    "long": 8.979
  },
  {
    "zipCode": 8762,
    "city": "Schwanden GL",
    "lat": 46.9954,
    "long": 9.0701
  },
  {
    "zipCode": 8762,
    "city": "Sool",
    "lat": 47.0007,
    "long": 9.086
  },
  {
    "zipCode": 8762,
    "city": "Schwändi b. Schwanden",
    "lat": 46.9981,
    "long": 9.0781
  },
  {
    "zipCode": 8765,
    "city": "Engi",
    "lat": 46.9824,
    "long": 9.1531
  },
  {
    "zipCode": 8766,
    "city": "Matt",
    "lat": 46.9595,
    "long": 9.1712
  },
  {
    "zipCode": 8767,
    "city": "Elm",
    "lat": 46.919,
    "long": 9.1724
  },
  {
    "zipCode": 8772,
    "city": "Nidfurn",
    "lat": 46.9867,
    "long": 9.0547
  },
  {
    "zipCode": 8773,
    "city": "Haslen GL",
    "lat": 46.9815,
    "long": 9.058
  },
  {
    "zipCode": 8774,
    "city": "Leuggelbach",
    "lat": 46.9763,
    "long": 9.0459
  },
  {
    "zipCode": 8775,
    "city": "Luchsingen",
    "lat": 46.9664,
    "long": 9.0371
  },
  {
    "zipCode": 8775,
    "city": "Hätzingen",
    "lat": 46.9664,
    "long": 9.0371
  },
  {
    "zipCode": 8777,
    "city": "Diesbach GL",
    "lat": 46.9491,
    "long": 9.0309
  },
  {
    "zipCode": 8777,
    "city": "Betschwanden",
    "lat": 46.9463,
    "long": 9.0276
  },
  {
    "zipCode": 8782,
    "city": "Rüti GL",
    "lat": 46.9378,
    "long": 9.0169
  },
  {
    "zipCode": 8783,
    "city": "Linthal",
    "lat": 46.9213,
    "long": 8.998
  },
  {
    "zipCode": 8784,
    "city": "Braunwald",
    "lat": 46.9416,
    "long": 8.9964
  },
  {
    "zipCode": 8800,
    "city": "Thalwil",
    "lat": 47.2918,
    "long": 8.5635
  },
  {
    "zipCode": 8802,
    "city": "Kilchberg ZH",
    "lat": 47.3244,
    "long": 8.5455
  },
  {
    "zipCode": 8803,
    "city": "Rüschlikon",
    "lat": 47.3069,
    "long": 8.5514
  },
  {
    "zipCode": 8804,
    "city": "Au ZH",
    "lat": 47.2418,
    "long": 8.6441
  },
  {
    "zipCode": 8805,
    "city": "Richterswil",
    "lat": 47.2062,
    "long": 8.6969
  },
  {
    "zipCode": 8806,
    "city": "Bäch SZ",
    "lat": 47.2039,
    "long": 8.7322
  },
  {
    "zipCode": 8807,
    "city": "Freienbach",
    "lat": 47.2053,
    "long": 8.7584
  },
  {
    "zipCode": 8808,
    "city": "Pfäffikon SZ",
    "lat": 47.2011,
    "long": 8.7782
  },
  {
    "zipCode": 8810,
    "city": "Horgen",
    "lat": 47.2598,
    "long": 8.5978
  },
  {
    "zipCode": 8815,
    "city": "Horgenberg",
    "lat": 47.2485,
    "long": 8.5877
  },
  {
    "zipCode": 8816,
    "city": "Hirzel",
    "lat": 47.2167,
    "long": 8.6
  },
  {
    "zipCode": 8820,
    "city": "Wädenswil",
    "lat": 47.2268,
    "long": 8.6687
  },
  {
    "zipCode": 8824,
    "city": "Schönenberg ZH",
    "lat": 47.1918,
    "long": 8.6449
  },
  {
    "zipCode": 8825,
    "city": "Hütten",
    "lat": 47.1757,
    "long": 8.6665
  },
  {
    "zipCode": 8832,
    "city": "Wilen b. Wollerau",
    "lat": 47.1948,
    "long": 8.719
  },
  {
    "zipCode": 8832,
    "city": "Wollerau",
    "lat": 47.1948,
    "long": 8.719
  },
  {
    "zipCode": 8832,
    "city": "Wollerau",
    "lat": 47.1948,
    "long": 8.719
  },
  {
    "zipCode": 8833,
    "city": "Samstagern",
    "lat": 47.1917,
    "long": 8.682
  },
  {
    "zipCode": 8834,
    "city": "Schindellegi",
    "lat": 47.1746,
    "long": 8.7134
  },
  {
    "zipCode": 8835,
    "city": "Feusisberg",
    "lat": 47.1871,
    "long": 8.7472
  },
  {
    "zipCode": 8836,
    "city": "Bennau",
    "lat": 47.1502,
    "long": 8.7305
  },
  {
    "zipCode": 8840,
    "city": "Einsiedeln",
    "lat": 47.1285,
    "long": 8.7473
  },
  {
    "zipCode": 8840,
    "city": "Trachslau",
    "lat": 47.1028,
    "long": 8.7294
  },
  {
    "zipCode": 8841,
    "city": "Gross",
    "lat": 47.1178,
    "long": 8.7744
  },
  {
    "zipCode": 8842,
    "city": "Unteriberg",
    "lat": 47.0626,
    "long": 8.8052
  },
  {
    "zipCode": 8843,
    "city": "Oberiberg",
    "lat": 47.0384,
    "long": 8.7792
  },
  {
    "zipCode": 8844,
    "city": "Euthal",
    "lat": 47.0969,
    "long": 8.8114
  },
  {
    "zipCode": 8845,
    "city": "Studen SZ",
    "lat": 47.0735,
    "long": 8.8418
  },
  {
    "zipCode": 8846,
    "city": "Willerzell",
    "lat": 47.1332,
    "long": 8.7935
  },
  {
    "zipCode": 8847,
    "city": "Egg SZ",
    "lat": 47.1631,
    "long": 8.7848
  },
  {
    "zipCode": 8849,
    "city": "Alpthal",
    "lat": 47.0695,
    "long": 8.716
  },
  {
    "zipCode": 8852,
    "city": "Altendorf",
    "lat": 47.1899,
    "long": 8.8382
  },
  {
    "zipCode": 8853,
    "city": "Lachen",
    "lat": 47.1993,
    "long": 8.8543
  },
  {
    "zipCode": 8854,
    "city": "Galgenen",
    "lat": 47.1823,
    "long": 8.8705
  },
  {
    "zipCode": 8854,
    "city": "Siebnen",
    "lat": 47.1745,
    "long": 8.8978
  },
  {
    "zipCode": 8855,
    "city": "Wangen SZ",
    "lat": 47.1908,
    "long": 8.895
  },
  {
    "zipCode": 8856,
    "city": "Tuggen",
    "lat": 47.2029,
    "long": 8.949
  },
  {
    "zipCode": 8857,
    "city": "Vorderthal",
    "lat": 47.1217,
    "long": 8.9022
  },
  {
    "zipCode": 8858,
    "city": "Innerthal",
    "lat": 47.1057,
    "long": 8.9201
  },
  {
    "zipCode": 8862,
    "city": "Schübelbach",
    "lat": 47.1733,
    "long": 8.9281
  },
  {
    "zipCode": 8863,
    "city": "Buttikon SZ",
    "lat": 47.1753,
    "long": 8.9558
  },
  {
    "zipCode": 8864,
    "city": "Reichenburg",
    "lat": 47.171,
    "long": 8.977
  },
  {
    "zipCode": 8865,
    "city": "Bilten",
    "lat": 47.15,
    "long": 9.0255
  },
  {
    "zipCode": 8866,
    "city": "Ziegelbrücke",
    "lat": 47.1324,
    "long": 9.0603
  },
  {
    "zipCode": 8867,
    "city": "Niederurnen",
    "lat": 47.126,
    "long": 9.0543
  },
  {
    "zipCode": 8868,
    "city": "Oberurnen",
    "lat": 47.1141,
    "long": 9.0587
  },
  {
    "zipCode": 8872,
    "city": "Weesen",
    "lat": 47.1345,
    "long": 9.0964
  },
  {
    "zipCode": 8873,
    "city": "Amden",
    "lat": 47.1489,
    "long": 9.1423
  },
  {
    "zipCode": 8874,
    "city": "Mühlehorn",
    "lat": 47.1176,
    "long": 9.1724
  },
  {
    "zipCode": 8877,
    "city": "Murg",
    "lat": 47.113,
    "long": 9.2155
  },
  {
    "zipCode": 8878,
    "city": "Quinten",
    "lat": 47.129,
    "long": 9.2144
  },
  {
    "zipCode": 8879,
    "city": "Pizolpark (Mels)",
    "lat": 47.0008,
    "long": 9.3374
  },
  {
    "zipCode": 8880,
    "city": "Walenstadt",
    "lat": 47.1241,
    "long": 9.3119
  },
  {
    "zipCode": 8881,
    "city": "Walenstadtberg",
    "lat": 47.1374,
    "long": 9.2903
  },
  {
    "zipCode": 8881,
    "city": "Tscherlach",
    "lat": 47.1202,
    "long": 9.3345
  },
  {
    "zipCode": 8882,
    "city": "Unterterzen",
    "lat": 47.1128,
    "long": 9.2531
  },
  {
    "zipCode": 8883,
    "city": "Quarten",
    "lat": 47.107,
    "long": 9.242
  },
  {
    "zipCode": 8884,
    "city": "Oberterzen",
    "lat": 47.1023,
    "long": 9.2594
  },
  {
    "zipCode": 8885,
    "city": "Mols",
    "lat": 47.112,
    "long": 9.2782
  },
  {
    "zipCode": 8886,
    "city": "Mädris-Vermol",
    "lat": 47.05,
    "long": 9.3944
  },
  {
    "zipCode": 8887,
    "city": "Mels",
    "lat": 47.0456,
    "long": 9.4232
  },
  {
    "zipCode": 8888,
    "city": "Heiligkreuz (Mels)",
    "lat": 47.0591,
    "long": 9.4127
  },
  {
    "zipCode": 8889,
    "city": "Plons",
    "lat": 47.0575,
    "long": 9.4008
  },
  {
    "zipCode": 8890,
    "city": "Flums",
    "lat": 47.0906,
    "long": 9.343
  },
  {
    "zipCode": 8892,
    "city": "Berschis",
    "lat": 47.1068,
    "long": 9.3464
  },
  {
    "zipCode": 8893,
    "city": "Flums Hochwiese",
    "lat": 47.0839,
    "long": 9.3722
  },
  {
    "zipCode": 8894,
    "city": "Flumserberg Saxli",
    "lat": 47.0776,
    "long": 9.3464
  },
  {
    "zipCode": 8895,
    "city": "Flumserberg Portels",
    "lat": 47.084,
    "long": 9.3372
  },
  {
    "zipCode": 8896,
    "city": "Flumserberg Bergheim",
    "lat": 47.0981,
    "long": 9.3078
  },
  {
    "zipCode": 8897,
    "city": "Flumserberg Tannenheim",
    "lat": 47.0891,
    "long": 9.3034
  },
  {
    "zipCode": 8898,
    "city": "Flumserberg Tannenbodenalp",
    "lat": 47.0932,
    "long": 9.2816
  },
  {
    "zipCode": 8901,
    "city": "Urdorf",
    "lat": 47.3798,
    "long": 8.4224
  },
  {
    "zipCode": 8902,
    "city": "Urdorf",
    "lat": 47.3851,
    "long": 8.4258
  },
  {
    "zipCode": 8903,
    "city": "Birmensdorf ZH",
    "lat": 47.3552,
    "long": 8.4426
  },
  {
    "zipCode": 8904,
    "city": "Aesch ZH",
    "lat": 47.3367,
    "long": 8.441
  },
  {
    "zipCode": 8905,
    "city": "Arni AG",
    "lat": 47.3182,
    "long": 8.4247
  },
  {
    "zipCode": 8905,
    "city": "Islisberg",
    "lat": 47.322,
    "long": 8.4414
  },
  {
    "zipCode": 8906,
    "city": "Bonstetten",
    "lat": 47.315,
    "long": 8.4684
  },
  {
    "zipCode": 8907,
    "city": "Wettswil",
    "lat": 47.2695,
    "long": 8.4744
  },
  {
    "zipCode": 8908,
    "city": "Hedingen",
    "lat": 47.2979,
    "long": 8.4483
  },
  {
    "zipCode": 8909,
    "city": "Zwillikon",
    "lat": 47.2883,
    "long": 8.4312
  },
  {
    "zipCode": 8910,
    "city": "Affoltern am Albis",
    "lat": 47.2774,
    "long": 8.4513
  },
  {
    "zipCode": 8911,
    "city": "Rifferswil",
    "lat": 47.2437,
    "long": 8.4969
  },
  {
    "zipCode": 8912,
    "city": "Obfelden",
    "lat": 47.2641,
    "long": 8.4215
  },
  {
    "zipCode": 8913,
    "city": "Ottenbach",
    "lat": 47.2823,
    "long": 8.4043
  },
  {
    "zipCode": 8914,
    "city": "Aeugst am Albis",
    "lat": 47.2754,
    "long": 8.4897
  },
  {
    "zipCode": 8914,
    "city": "Aeugstertal",
    "lat": 47.2754,
    "long": 8.4897
  },
  {
    "zipCode": 8915,
    "city": "Hausen am Albis",
    "lat": 47.245,
    "long": 8.533
  },
  {
    "zipCode": 8916,
    "city": "Jonen",
    "lat": 47.2974,
    "long": 8.3934
  },
  {
    "zipCode": 8917,
    "city": "Oberlunkhofen",
    "lat": 47.3115,
    "long": 8.3914
  },
  {
    "zipCode": 8918,
    "city": "Unterlunkhofen",
    "lat": 47.3212,
    "long": 8.381
  },
  {
    "zipCode": 8919,
    "city": "Rottenschwil",
    "lat": 47.3137,
    "long": 8.3614
  },
  {
    "zipCode": 8925,
    "city": "Ebertswil",
    "lat": 47.2264,
    "long": 8.5496
  },
  {
    "zipCode": 8926,
    "city": "Uerzlikon",
    "lat": 47.2215,
    "long": 8.4981
  },
  {
    "zipCode": 8926,
    "city": "Kappel am Albis",
    "lat": 47.2281,
    "long": 8.5273
  },
  {
    "zipCode": 8926,
    "city": "Hauptikon",
    "lat": 47.2304,
    "long": 8.4954
  },
  {
    "zipCode": 8932,
    "city": "Mettmenstetten",
    "lat": 47.2453,
    "long": 8.4635
  },
  {
    "zipCode": 8933,
    "city": "Maschwanden",
    "lat": 47.2343,
    "long": 8.4271
  },
  {
    "zipCode": 8934,
    "city": "Knonau",
    "lat": 47.2235,
    "long": 8.462
  },
  {
    "zipCode": 8942,
    "city": "Oberrieden",
    "lat": 47.2744,
    "long": 8.5784
  },
  {
    "zipCode": 8951,
    "city": "Fahrweid",
    "lat": 47.4117,
    "long": 8.4156
  },
  {
    "zipCode": 8952,
    "city": "Schlieren",
    "lat": 47.3967,
    "long": 8.4476
  },
  {
    "zipCode": 8953,
    "city": "Dietikon",
    "lat": 47.4017,
    "long": 8.4001
  },
  {
    "zipCode": 8954,
    "city": "Geroldswil",
    "lat": 47.4221,
    "long": 8.4108
  },
  {
    "zipCode": 8955,
    "city": "Oetwil an der Limmat",
    "lat": 47.4283,
    "long": 8.3949
  },
  {
    "zipCode": 8956,
    "city": "Killwangen",
    "lat": 47.4318,
    "long": 8.3481
  },
  {
    "zipCode": 8957,
    "city": "Spreitenbach",
    "lat": 47.4202,
    "long": 8.363
  },
  {
    "zipCode": 8962,
    "city": "Bergdietikon",
    "lat": 47.3892,
    "long": 8.3862
  },
  {
    "zipCode": 8964,
    "city": "Rudolfstetten",
    "lat": 47.371,
    "long": 8.3808
  },
  {
    "zipCode": 8965,
    "city": "Berikon",
    "lat": 47.3514,
    "long": 8.3721
  },
  {
    "zipCode": 8966,
    "city": "Oberwil-Lieli",
    "lat": 47.3338,
    "long": 8.3812
  },
  {
    "zipCode": 8967,
    "city": "Widen",
    "lat": 47.3692,
    "long": 8.3635
  },
  {
    "zipCode": 9000,
    "city": "St. Gall",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9001,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9004,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9006,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9007,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9008,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9010,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9011,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9012,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9013,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9014,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9015,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9016,
    "city": "St. Gallen",
    "lat": 47.4239,
    "long": 9.3748
  },
  {
    "zipCode": 9020,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9022,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9023,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9024,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9026,
    "city": "St. Gallen K AG",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9027,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9028,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9029,
    "city": "St. Gallen",
    "lat": 47.4221,
    "long": 9.3755
  },
  {
    "zipCode": 9030,
    "city": "St. Josefen",
    "lat": 47.426,
    "long": 9.337
  },
  {
    "zipCode": 9030,
    "city": "Abtwil SG",
    "lat": 47.4237,
    "long": 9.3211
  },
  {
    "zipCode": 9032,
    "city": "Engelburg",
    "lat": 47.4455,
    "long": 9.342
  },
  {
    "zipCode": 9033,
    "city": "Untereggen",
    "lat": 47.454,
    "long": 9.451
  },
  {
    "zipCode": 9034,
    "city": "Eggersriet",
    "lat": 47.442,
    "long": 9.469
  },
  {
    "zipCode": 9035,
    "city": "Grub AR",
    "lat": 47.4477,
    "long": 9.5097
  },
  {
    "zipCode": 9036,
    "city": "Grub SG",
    "lat": 47.4538,
    "long": 9.5136
  },
  {
    "zipCode": 9037,
    "city": "Speicherschwendi",
    "lat": 47.4265,
    "long": 9.4378
  },
  {
    "zipCode": 9038,
    "city": "Rehetobel",
    "lat": 47.4261,
    "long": 9.483
  },
  {
    "zipCode": 9042,
    "city": "Speicher",
    "lat": 47.4109,
    "long": 9.4433
  },
  {
    "zipCode": 9043,
    "city": "Trogen",
    "lat": 47.4078,
    "long": 9.465
  },
  {
    "zipCode": 9044,
    "city": "Wald AR",
    "lat": 47.4156,
    "long": 9.491
  },
  {
    "zipCode": 9050,
    "city": "Appenzell Eggerstanden",
    "lat": 47.3324,
    "long": 9.4686
  },
  {
    "zipCode": 9050,
    "city": "Appenzell",
    "lat": 47.331,
    "long": 9.41
  },
  {
    "zipCode": 9050,
    "city": "Appenzell Steinegg",
    "lat": 47.322,
    "long": 9.4315
  },
  {
    "zipCode": 9050,
    "city": "Appenzell Meistersrüte",
    "lat": 47.3446,
    "long": 9.4324
  },
  {
    "zipCode": 9050,
    "city": "Appenzell Enggenhütten",
    "lat": 47.3531,
    "long": 9.3623
  },
  {
    "zipCode": 9050,
    "city": "Appenzell Schlatt",
    "lat": 47.3531,
    "long": 9.3623
  },
  {
    "zipCode": 9052,
    "city": "Niederteufen",
    "lat": 47.394,
    "long": 9.3667
  },
  {
    "zipCode": 9053,
    "city": "Teufen AR",
    "lat": 47.3908,
    "long": 9.3864
  },
  {
    "zipCode": 9054,
    "city": "Haslen AI",
    "lat": 47.3693,
    "long": 9.3675
  },
  {
    "zipCode": 9055,
    "city": "Bühler",
    "lat": 47.3735,
    "long": 9.4251
  },
  {
    "zipCode": 9056,
    "city": "Gais",
    "lat": 47.3615,
    "long": 9.4536
  },
  {
    "zipCode": 9057,
    "city": "Wasserauen",
    "lat": 47.2834,
    "long": 9.4258
  },
  {
    "zipCode": 9057,
    "city": "Weissbad",
    "lat": 47.3089,
    "long": 9.4347
  },
  {
    "zipCode": 9057,
    "city": "Schwende",
    "lat": 47.303,
    "long": 9.4367
  },
  {
    "zipCode": 9058,
    "city": "Brülisau",
    "lat": 47.2986,
    "long": 9.457
  },
  {
    "zipCode": 9062,
    "city": "Lustmühle",
    "lat": 47.3991,
    "long": 9.3585
  },
  {
    "zipCode": 9063,
    "city": "Stein AR",
    "lat": 47.3713,
    "long": 9.3435
  },
  {
    "zipCode": 9064,
    "city": "Hundwil",
    "lat": 47.3646,
    "long": 9.3185
  },
  {
    "zipCode": 9100,
    "city": "Herisau",
    "lat": 47.3861,
    "long": 9.2792
  },
  {
    "zipCode": 9102,
    "city": "Herisau",
    "lat": 47.3829,
    "long": 9.2741
  },
  {
    "zipCode": 9103,
    "city": "Schwellbrunn",
    "lat": 47.3525,
    "long": 9.2489
  },
  {
    "zipCode": 9104,
    "city": "Waldstatt",
    "lat": 47.3563,
    "long": 9.2834
  },
  {
    "zipCode": 9105,
    "city": "Schönengrund",
    "lat": 47.3259,
    "long": 9.2269
  },
  {
    "zipCode": 9107,
    "city": "Urnäsch",
    "lat": 47.3167,
    "long": 9.2795
  },
  {
    "zipCode": 9108,
    "city": "Jakobsbad",
    "lat": 47.3196,
    "long": 9.3263
  },
  {
    "zipCode": 9108,
    "city": "Gontenbad",
    "lat": 47.3331,
    "long": 9.3737
  },
  {
    "zipCode": 9108,
    "city": "Gonten",
    "lat": 47.3272,
    "long": 9.347
  },
  {
    "zipCode": 9112,
    "city": "Schachen b. Herisau",
    "lat": 47.3865,
    "long": 9.2445
  },
  {
    "zipCode": 9113,
    "city": "Degersheim",
    "lat": 47.3743,
    "long": 9.2002
  },
  {
    "zipCode": 9114,
    "city": "Hoffeld",
    "lat": 47.3643,
    "long": 9.1747
  },
  {
    "zipCode": 9115,
    "city": "Dicken",
    "lat": 47.3379,
    "long": 9.1917
  },
  {
    "zipCode": 9116,
    "city": "Wolfertswil",
    "lat": 47.3957,
    "long": 9.1839
  },
  {
    "zipCode": 9122,
    "city": "Ebersol",
    "lat": 47.3489,
    "long": 9.1517
  },
  {
    "zipCode": 9122,
    "city": "Mogelsberg",
    "lat": 47.3622,
    "long": 9.1354
  },
  {
    "zipCode": 9123,
    "city": "Nassen",
    "lat": 47.3744,
    "long": 9.1373
  },
  {
    "zipCode": 9125,
    "city": "Brunnadern",
    "lat": 47.3359,
    "long": 9.1302
  },
  {
    "zipCode": 9126,
    "city": "Necker",
    "lat": 47.3476,
    "long": 9.1302
  },
  {
    "zipCode": 9127,
    "city": "St. Peterzell",
    "lat": 47.3178,
    "long": 9.176
  },
  {
    "zipCode": 9200,
    "city": "Gossau SG",
    "lat": 47.4155,
    "long": 9.2548
  },
  {
    "zipCode": 9201,
    "city": "Gossau SG",
    "lat": 47.421,
    "long": 9.2536
  },
  {
    "zipCode": 9203,
    "city": "Niederwil SG",
    "lat": 47.4396,
    "long": 9.1992
  },
  {
    "zipCode": 9204,
    "city": "Andwil SG",
    "lat": 47.4386,
    "long": 9.2744
  },
  {
    "zipCode": 9205,
    "city": "Waldkirch",
    "lat": 47.4686,
    "long": 9.2867
  },
  {
    "zipCode": 9212,
    "city": "Arnegg",
    "lat": 47.443,
    "long": 9.2552
  },
  {
    "zipCode": 9213,
    "city": "Hauptwil",
    "lat": 47.4801,
    "long": 9.2507
  },
  {
    "zipCode": 9214,
    "city": "Kradolf",
    "lat": 47.525,
    "long": 9.2014
  },
  {
    "zipCode": 9215,
    "city": "Buhwil",
    "lat": 47.5285,
    "long": 9.1676
  },
  {
    "zipCode": 9215,
    "city": "Schönenberg an der Thur",
    "lat": 47.5214,
    "long": 9.1986
  },
  {
    "zipCode": 9216,
    "city": "Heldswil",
    "lat": 47.5304,
    "long": 9.2222
  },
  {
    "zipCode": 9216,
    "city": "Hohentannen",
    "lat": 47.5304,
    "long": 9.2222
  },
  {
    "zipCode": 9217,
    "city": "Neukirch an der Thur",
    "lat": 47.5122,
    "long": 9.174
  },
  {
    "zipCode": 9220,
    "city": "Bischofszell",
    "lat": 47.4957,
    "long": 9.2388
  },
  {
    "zipCode": 9223,
    "city": "Schweizersholz",
    "lat": 47.5028,
    "long": 9.1963
  },
  {
    "zipCode": 9223,
    "city": "Halden",
    "lat": 47.5055,
    "long": 9.2106
  },
  {
    "zipCode": 9225,
    "city": "St. Pelagiberg",
    "lat": 47.4892,
    "long": 9.3025
  },
  {
    "zipCode": 9225,
    "city": "Wilen (Gottshaus)",
    "lat": 47.495,
    "long": 9.2846
  },
  {
    "zipCode": 9230,
    "city": "Flawil",
    "lat": 47.413,
    "long": 9.1832
  },
  {
    "zipCode": 9231,
    "city": "Egg (Flawil)",
    "lat": 47.3931,
    "long": 9.2276
  },
  {
    "zipCode": 9240,
    "city": "Uzwil",
    "lat": 47.4365,
    "long": 9.1342
  },
  {
    "zipCode": 9240,
    "city": "Niederglatt SG",
    "lat": 47.43,
    "long": 9.1685
  },
  {
    "zipCode": 9242,
    "city": "Oberuzwil",
    "lat": 47.4308,
    "long": 9.1272
  },
  {
    "zipCode": 9243,
    "city": "Jonschwil",
    "lat": 47.424,
    "long": 9.0869
  },
  {
    "zipCode": 9244,
    "city": "Niederuzwil",
    "lat": 47.4465,
    "long": 9.1417
  },
  {
    "zipCode": 9245,
    "city": "Sonnental",
    "lat": 47.4583,
    "long": 9.1394
  },
  {
    "zipCode": 9245,
    "city": "Oberbüren",
    "lat": 47.4519,
    "long": 9.1586
  },
  {
    "zipCode": 9246,
    "city": "Niederbüren",
    "lat": 47.4655,
    "long": 9.2057
  },
  {
    "zipCode": 9247,
    "city": "Henau",
    "lat": 47.4548,
    "long": 9.1164
  },
  {
    "zipCode": 9248,
    "city": "Bichwil",
    "lat": 47.4218,
    "long": 9.138
  },
  {
    "zipCode": 9249,
    "city": "Algetshausen",
    "lat": 47.4491,
    "long": 9.1084
  },
  {
    "zipCode": 9249,
    "city": "Oberstetten",
    "lat": 47.4511,
    "long": 9.0951
  },
  {
    "zipCode": 9249,
    "city": "Niederstetten",
    "lat": 47.4531,
    "long": 9.0817
  },
  {
    "zipCode": 9300,
    "city": "Wittenbach",
    "lat": 47.4611,
    "long": 9.386
  },
  {
    "zipCode": 9301,
    "city": "Wittenbach",
    "lat": 47.4667,
    "long": 9.3795
  },
  {
    "zipCode": 9304,
    "city": "Bernhardzell",
    "lat": 47.4747,
    "long": 9.3363
  },
  {
    "zipCode": 9305,
    "city": "Berg SG",
    "lat": 47.4867,
    "long": 9.4099
  },
  {
    "zipCode": 9306,
    "city": "Freidorf TG",
    "lat": 47.4861,
    "long": 9.3975
  },
  {
    "zipCode": 9308,
    "city": "Lömmenschwil",
    "lat": 47.4979,
    "long": 9.3551
  },
  {
    "zipCode": 9312,
    "city": "Häggenschwil",
    "lat": 47.4946,
    "long": 9.3449
  },
  {
    "zipCode": 9313,
    "city": "Muolen",
    "lat": 47.521,
    "long": 9.3248
  },
  {
    "zipCode": 9314,
    "city": "Steinebrunn",
    "lat": 47.5355,
    "long": 9.3441
  },
  {
    "zipCode": 9315,
    "city": "Neukirch (Egnach)",
    "lat": 47.5287,
    "long": 9.37
  },
  {
    "zipCode": 9315,
    "city": "Winden",
    "lat": 47.5065,
    "long": 9.3592
  },
  {
    "zipCode": 9320,
    "city": "Arbon",
    "lat": 47.5167,
    "long": 9.4333
  },
  {
    "zipCode": 9322,
    "city": "Egnach",
    "lat": 47.5427,
    "long": 9.3805
  },
  {
    "zipCode": 9323,
    "city": "Steinach",
    "lat": 47.5018,
    "long": 9.4385
  },
  {
    "zipCode": 9325,
    "city": "Roggwil TG",
    "lat": 47.4998,
    "long": 9.3958
  },
  {
    "zipCode": 9326,
    "city": "Horn",
    "lat": 47.4943,
    "long": 9.4625
  },
  {
    "zipCode": 9327,
    "city": "Tübach",
    "lat": 47.4868,
    "long": 9.4546
  },
  {
    "zipCode": 9400,
    "city": "Rorschach",
    "lat": 47.478,
    "long": 9.4903
  },
  {
    "zipCode": 9401,
    "city": "Rorschach",
    "lat": 47.4757,
    "long": 9.4949
  },
  {
    "zipCode": 9402,
    "city": "Mörschwil",
    "lat": 47.471,
    "long": 9.4228
  },
  {
    "zipCode": 9403,
    "city": "Goldach",
    "lat": 47.474,
    "long": 9.4671
  },
  {
    "zipCode": 9404,
    "city": "Rorschacherberg",
    "lat": 47.4731,
    "long": 9.5112
  },
  {
    "zipCode": 9405,
    "city": "Wienacht-Tobel",
    "lat": 47.4648,
    "long": 9.5334
  },
  {
    "zipCode": 9410,
    "city": "Heiden",
    "lat": 47.4425,
    "long": 9.5329
  },
  {
    "zipCode": 9411,
    "city": "Schachen b. Reute",
    "lat": 47.4268,
    "long": 9.5618
  },
  {
    "zipCode": 9411,
    "city": "Reute AR",
    "lat": 47.4201,
    "long": 9.5731
  },
  {
    "zipCode": 9411,
    "city": "Reute AR",
    "lat": 47.4246,
    "long": 9.6125
  },
  {
    "zipCode": 9413,
    "city": "Oberegg",
    "lat": 47.4253,
    "long": 9.5513
  },
  {
    "zipCode": 9413,
    "city": "Oberegg",
    "lat": 47.4253,
    "long": 9.5513
  },
  {
    "zipCode": 9422,
    "city": "Staad SG",
    "lat": 47.4806,
    "long": 9.5325
  },
  {
    "zipCode": 9423,
    "city": "Altenrhein",
    "lat": 47.4898,
    "long": 9.5519
  },
  {
    "zipCode": 9424,
    "city": "Rheineck",
    "lat": 47.4663,
    "long": 9.5903
  },
  {
    "zipCode": 9425,
    "city": "Thal",
    "lat": 47.4668,
    "long": 9.5664
  },
  {
    "zipCode": 9426,
    "city": "Lutzenberg",
    "lat": 47.4613,
    "long": 9.5761
  },
  {
    "zipCode": 9427,
    "city": "Wolfhalden",
    "lat": 47.4527,
    "long": 9.5481
  },
  {
    "zipCode": 9428,
    "city": "Walzenhausen",
    "lat": 47.4487,
    "long": 9.605
  },
  {
    "zipCode": 9430,
    "city": "St. Margrethen SG",
    "lat": 47.4525,
    "long": 9.6374
  },
  {
    "zipCode": 9434,
    "city": "Au SG",
    "lat": 47.4309,
    "long": 9.6345
  },
  {
    "zipCode": 9435,
    "city": "Heerbrugg",
    "lat": 47.4149,
    "long": 9.6268
  },
  {
    "zipCode": 9436,
    "city": "Balgach",
    "lat": 47.4056,
    "long": 9.607
  },
  {
    "zipCode": 9437,
    "city": "Marbach SG",
    "lat": 47.3917,
    "long": 9.5672
  },
  {
    "zipCode": 9442,
    "city": "Büriswilen",
    "lat": 47.4349,
    "long": 9.6058
  },
  {
    "zipCode": 9442,
    "city": "Berneck",
    "lat": 47.4255,
    "long": 9.6162
  },
  {
    "zipCode": 9443,
    "city": "Widnau",
    "lat": 47.4083,
    "long": 9.6332
  },
  {
    "zipCode": 9444,
    "city": "Diepoldsau",
    "lat": 47.386,
    "long": 9.6556
  },
  {
    "zipCode": 9445,
    "city": "Rebstein",
    "lat": 47.3981,
    "long": 9.585
  },
  {
    "zipCode": 9450,
    "city": "Altstätten SG",
    "lat": 47.3777,
    "long": 9.5475
  },
  {
    "zipCode": 9450,
    "city": "Lüchingen",
    "lat": 47.3885,
    "long": 9.556
  },
  {
    "zipCode": 9451,
    "city": "Kriessern",
    "lat": 47.3688,
    "long": 9.6113
  },
  {
    "zipCode": 9452,
    "city": "Hinterforst",
    "lat": 47.36,
    "long": 9.5307
  },
  {
    "zipCode": 9453,
    "city": "Eichberg",
    "lat": 47.3437,
    "long": 9.5314
  },
  {
    "zipCode": 9462,
    "city": "Montlingen",
    "lat": 47.3359,
    "long": 9.5906
  },
  {
    "zipCode": 9462,
    "city": "Montlingen",
    "lat": 47.3359,
    "long": 9.5906
  },
  {
    "zipCode": 9463,
    "city": "Oberriet SG",
    "lat": 47.3209,
    "long": 9.5681
  },
  {
    "zipCode": 9464,
    "city": "Rüthi (Rheintal)",
    "lat": 47.2948,
    "long": 9.5386
  },
  {
    "zipCode": 9464,
    "city": "Lienz",
    "lat": 47.2773,
    "long": 9.5163
  },
  {
    "zipCode": 9465,
    "city": "Salez",
    "lat": 47.2365,
    "long": 9.5
  },
  {
    "zipCode": 9466,
    "city": "Sennwald",
    "lat": 47.2606,
    "long": 9.5027
  },
  {
    "zipCode": 9467,
    "city": "Frümsen",
    "lat": 47.2438,
    "long": 9.4679
  },
  {
    "zipCode": 9468,
    "city": "Sax",
    "lat": 47.2329,
    "long": 9.4577
  },
  {
    "zipCode": 9469,
    "city": "Haag (Rheintal)",
    "lat": 47.2099,
    "long": 9.4893
  },
  {
    "zipCode": 9470,
    "city": "Buchs SG",
    "lat": 47.1674,
    "long": 9.4779
  },
  {
    "zipCode": 9470,
    "city": "Werdenberg",
    "lat": 47.1698,
    "long": 9.4549
  },
  {
    "zipCode": 9471,
    "city": "Buchs SG 1",
    "lat": 47.166,
    "long": 9.4627
  },
  {
    "zipCode": 9471,
    "city": "Buchs SG 3",
    "lat": 47.166,
    "long": 9.4627
  },
  {
    "zipCode": 9472,
    "city": "Grabs",
    "lat": 47.1825,
    "long": 9.444
  },
  {
    "zipCode": 9472,
    "city": "Grabserberg",
    "lat": 47.1816,
    "long": 9.4252
  },
  {
    "zipCode": 9473,
    "city": "Gams",
    "lat": 47.2043,
    "long": 9.4417
  },
  {
    "zipCode": 9475,
    "city": "Sevelen",
    "lat": 47.1221,
    "long": 9.486
  },
  {
    "zipCode": 9476,
    "city": "Weite",
    "lat": 47.0938,
    "long": 9.4983
  },
  {
    "zipCode": 9476,
    "city": "Fontnas",
    "lat": 47.0906,
    "long": 9.4886
  },
  {
    "zipCode": 9477,
    "city": "Trübbach",
    "lat": 47.0734,
    "long": 9.4783
  },
  {
    "zipCode": 9478,
    "city": "Azmoos",
    "lat": 47.0823,
    "long": 9.4768
  },
  {
    "zipCode": 9479,
    "city": "Oberschan",
    "lat": 47.0989,
    "long": 9.4746
  },
  {
    "zipCode": 9479,
    "city": "Malans SG",
    "lat": 47.0919,
    "long": 9.4778
  },
  {
    "zipCode": 9479,
    "city": "Gretschins",
    "lat": 47.099,
    "long": 9.4868
  },
  {
    "zipCode": 9500,
    "city": "Wil SG",
    "lat": 47.2884,
    "long": 9.1539
  },
  {
    "zipCode": 9500,
    "city": "Wil SG",
    "lat": 47.4615,
    "long": 9.0455
  },
  {
    "zipCode": 9501,
    "city": "Wil SG 1",
    "lat": 47.4757,
    "long": 9.0518
  },
  {
    "zipCode": 9502,
    "city": "Braunau",
    "lat": 47.5011,
    "long": 9.0696
  },
  {
    "zipCode": 9503,
    "city": "Stehrenberg",
    "lat": 47.5234,
    "long": 9.0897
  },
  {
    "zipCode": 9503,
    "city": "Lanterswil",
    "lat": 47.522,
    "long": 9.0971
  },
  {
    "zipCode": 9504,
    "city": "Friltschen",
    "lat": 47.54,
    "long": 9.0863
  },
  {
    "zipCode": 9506,
    "city": "Lommis",
    "lat": 47.5173,
    "long": 8.9967
  },
  {
    "zipCode": 9507,
    "city": "Stettfurt",
    "lat": 47.5259,
    "long": 8.9532
  },
  {
    "zipCode": 9508,
    "city": "Weingarten-Kalthäusern",
    "lat": 47.526,
    "long": 8.9867
  },
  {
    "zipCode": 9512,
    "city": "Rossrüti",
    "lat": 47.4757,
    "long": 9.0625
  },
  {
    "zipCode": 9514,
    "city": "Wuppenau",
    "lat": 47.4963,
    "long": 9.109
  },
  {
    "zipCode": 9515,
    "city": "Hosenruck",
    "lat": 47.4917,
    "long": 9.1239
  },
  {
    "zipCode": 9517,
    "city": "Mettlen",
    "lat": 47.5308,
    "long": 9.1233
  },
  {
    "zipCode": 9523,
    "city": "Züberwangen",
    "lat": 47.4671,
    "long": 9.0854
  },
  {
    "zipCode": 9524,
    "city": "Zuzwil SG",
    "lat": 47.4745,
    "long": 9.112
  },
  {
    "zipCode": 9525,
    "city": "Lenggenwil",
    "lat": 47.4763,
    "long": 9.1504
  },
  {
    "zipCode": 9526,
    "city": "Zuckenriet",
    "lat": 47.4851,
    "long": 9.1616
  },
  {
    "zipCode": 9527,
    "city": "Niederhelfenschwil",
    "lat": 47.4749,
    "long": 9.1854
  },
  {
    "zipCode": 9532,
    "city": "Rickenbach b. Wil",
    "lat": 47.4494,
    "long": 9.0484
  },
  {
    "zipCode": 9532,
    "city": "Rickenbach b. Wil",
    "lat": 47.4494,
    "long": 9.0484
  },
  {
    "zipCode": 9533,
    "city": "Kirchberg SG",
    "lat": 47.4116,
    "long": 9.0402
  },
  {
    "zipCode": 9533,
    "city": "Dietschwil",
    "lat": 47.4229,
    "long": 9.017
  },
  {
    "zipCode": 9534,
    "city": "Gähwil",
    "lat": 47.3987,
    "long": 9.0026
  },
  {
    "zipCode": 9535,
    "city": "Wilen b. Wil",
    "lat": 47.4514,
    "long": 9.0342
  },
  {
    "zipCode": 9536,
    "city": "Schwarzenbach SG",
    "lat": 47.4436,
    "long": 9.078
  },
  {
    "zipCode": 9542,
    "city": "Münchwilen TG",
    "lat": 47.4772,
    "long": 8.9968
  },
  {
    "zipCode": 9543,
    "city": "St. Margarethen TG",
    "lat": 47.4893,
    "long": 9.0018
  },
  {
    "zipCode": 9545,
    "city": "Wängi",
    "lat": 47.4965,
    "long": 8.9533
  },
  {
    "zipCode": 9546,
    "city": "Tuttwil",
    "lat": 47.4835,
    "long": 8.9422
  },
  {
    "zipCode": 9547,
    "city": "Wittenwil",
    "lat": 47.5048,
    "long": 8.9231
  },
  {
    "zipCode": 9548,
    "city": "Matzingen",
    "lat": 47.5196,
    "long": 8.9337
  },
  {
    "zipCode": 9552,
    "city": "Bronschhofen",
    "lat": 47.4783,
    "long": 9.0345
  },
  {
    "zipCode": 9553,
    "city": "Bettwiesen",
    "lat": 47.4972,
    "long": 9.0285
  },
  {
    "zipCode": 9554,
    "city": "Tägerschen",
    "lat": 47.5091,
    "long": 9.0321
  },
  {
    "zipCode": 9555,
    "city": "Tobel",
    "lat": 47.515,
    "long": 9.0336
  },
  {
    "zipCode": 9556,
    "city": "Zezikon",
    "lat": 47.5365,
    "long": 9.0237
  },
  {
    "zipCode": 9556,
    "city": "Affeltrangen",
    "lat": 47.5258,
    "long": 9.0331
  },
  {
    "zipCode": 9562,
    "city": "Märwil",
    "lat": 47.533,
    "long": 9.0747
  },
  {
    "zipCode": 9562,
    "city": "Buch b. Märwil",
    "lat": 47.533,
    "long": 9.0747
  },
  {
    "zipCode": 9565,
    "city": "Schmidshof",
    "lat": 47.5445,
    "long": 9.0553
  },
  {
    "zipCode": 9565,
    "city": "Rothenhausen",
    "lat": 47.5512,
    "long": 9.1026
  },
  {
    "zipCode": 9565,
    "city": "Bussnang",
    "lat": 47.5568,
    "long": 9.0816
  },
  {
    "zipCode": 9565,
    "city": "Oppikon",
    "lat": 47.5521,
    "long": 9.062
  },
  {
    "zipCode": 9565,
    "city": "Oberbussnang",
    "lat": 47.5511,
    "long": 9.0754
  },
  {
    "zipCode": 9573,
    "city": "Littenheid",
    "lat": 47.442,
    "long": 9.0104
  },
  {
    "zipCode": 9601,
    "city": "Lütisburg Station",
    "lat": 47.3851,
    "long": 9.0723
  },
  {
    "zipCode": 9602,
    "city": "Müselbach",
    "lat": 47.3936,
    "long": 9.0424
  },
  {
    "zipCode": 9602,
    "city": "Bazenheid",
    "lat": 47.4097,
    "long": 9.0706
  },
  {
    "zipCode": 9604,
    "city": "Lütisburg",
    "lat": 47.3945,
    "long": 9.0831
  },
  {
    "zipCode": 9604,
    "city": "Unterrindal",
    "lat": 47.4106,
    "long": 9.0911
  },
  {
    "zipCode": 9604,
    "city": "Oberrindal",
    "lat": 47.4091,
    "long": 9.1201
  },
  {
    "zipCode": 9606,
    "city": "Bütschwil",
    "lat": 47.3602,
    "long": 9.0721
  },
  {
    "zipCode": 9607,
    "city": "Mosnang",
    "lat": 47.3625,
    "long": 9.043
  },
  {
    "zipCode": 9608,
    "city": "Ganterschwil",
    "lat": 47.381,
    "long": 9.0924
  },
  {
    "zipCode": 9612,
    "city": "Dreien",
    "lat": 47.3734,
    "long": 9.0151
  },
  {
    "zipCode": 9613,
    "city": "Mühlrüti",
    "lat": 47.3716,
    "long": 8.9866
  },
  {
    "zipCode": 9614,
    "city": "Libingen",
    "lat": 47.33,
    "long": 9.0243
  },
  {
    "zipCode": 9615,
    "city": "Dietfurt",
    "lat": 47.3488,
    "long": 9.0809
  },
  {
    "zipCode": 9620,
    "city": "Lichtensteig",
    "lat": 47.3238,
    "long": 9.0876
  },
  {
    "zipCode": 9621,
    "city": "Oberhelfenschwil",
    "lat": 47.3567,
    "long": 9.1108
  },
  {
    "zipCode": 9622,
    "city": "Krinau",
    "lat": 47.3173,
    "long": 9.0505
  },
  {
    "zipCode": 9630,
    "city": "Wattwil",
    "lat": 47.2996,
    "long": 9.0866
  },
  {
    "zipCode": 9631,
    "city": "Ulisbach",
    "lat": 47.2876,
    "long": 9.1014
  },
  {
    "zipCode": 9633,
    "city": "Bächli (Hemberg)",
    "lat": 47.3069,
    "long": 9.1963
  },
  {
    "zipCode": 9633,
    "city": "Hemberg",
    "lat": 47.3006,
    "long": 9.1752
  },
  {
    "zipCode": 9642,
    "city": "Ebnat-Kappel",
    "lat": 47.262,
    "long": 9.1247
  },
  {
    "zipCode": 9643,
    "city": "Krummenau",
    "lat": 47.2476,
    "long": 9.1706
  },
  {
    "zipCode": 9650,
    "city": "Nesslau",
    "lat": 47.2228,
    "long": 9.2012
  },
  {
    "zipCode": 9651,
    "city": "Ennetbühl",
    "lat": 47.242,
    "long": 9.2126
  },
  {
    "zipCode": 9652,
    "city": "Neu St. Johann",
    "lat": 47.2306,
    "long": 9.195
  },
  {
    "zipCode": 9655,
    "city": "Stein SG",
    "lat": 47.2,
    "long": 9.2261
  },
  {
    "zipCode": 9656,
    "city": "Alt St. Johann",
    "lat": 47.1931,
    "long": 9.2813
  },
  {
    "zipCode": 9657,
    "city": "Unterwasser",
    "lat": 47.197,
    "long": 9.3086
  },
  {
    "zipCode": 9658,
    "city": "Wildhaus",
    "lat": 47.2058,
    "long": 9.354
  }
 ]

 module.exports = {default: citiesCoordinates}