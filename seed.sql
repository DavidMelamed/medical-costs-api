-- Auto-generated seed data for Medical Costs API
-- Source: CMS Medicare PFS 2026, CDC WISQARS, NHTSA
-- Generated: 2026-04-12T03:56:17.054Z

-- ============================================================================
-- Medical Procedures
-- ============================================================================
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99281', '99281', 'CPT', 'Emergency department visit - straightforward', 'Emergency Medicine', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99282', '99282', 'CPT', 'Emergency department visit - low complexity', 'Emergency Medicine', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99283', '99283', 'CPT', 'Emergency department visit - moderate complexity', 'Emergency Medicine', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99284', '99284', 'CPT', 'Emergency department visit - moderate-high complexity', 'Emergency Medicine', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99285', '99285', 'CPT', 'Emergency department visit - high complexity', 'Emergency Medicine', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99291', '99291', 'CPT', 'Critical care, first 30-74 minutes', 'Critical Care', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99292', '99292', 'CPT', 'Critical care, each additional 30 minutes', 'Critical Care', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99213', '99213', 'CPT', 'Office visit - established patient, low complexity', 'Evaluation & Management', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99214', '99214', 'CPT', 'Office visit - established patient, moderate complexity', 'Evaluation & Management', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_99215', '99215', 'CPT', 'Office visit - established patient, high complexity', 'Evaluation & Management', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_70450', '70450', 'CPT', 'CT head/brain without contrast', 'Radiology', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_70551', '70551', 'CPT', 'MRI brain without contrast', 'Radiology', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_70553', '70553', 'CPT', 'MRI brain with and without contrast', 'Radiology', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_70150', '70150', 'CPT', 'X-ray facial bones', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_70486', '70486', 'CPT', 'CT maxillofacial without contrast', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_72040', '72040', 'CPT', 'X-ray cervical spine 2-3 views', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_72100', '72100', 'CPT', 'X-ray lumbar spine 2-3 views', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_72141', '72141', 'CPT', 'MRI cervical spine without contrast', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_72146', '72146', 'CPT', 'MRI thoracic spine without contrast', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_72148', '72148', 'CPT', 'MRI lumbar spine without contrast', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_71045', '71045', 'CPT', 'Chest X-ray single view', 'Radiology', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_71260', '71260', 'CPT', 'CT chest with contrast', 'Radiology', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_74178', '74178', 'CPT', 'CT abdomen and pelvis with contrast', 'Radiology', 'Digestive', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_73030', '73030', 'CPT', 'X-ray shoulder complete', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_73221', '73221', 'CPT', 'MRI upper extremity without contrast', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_73560', '73560', 'CPT', 'X-ray knee 1-2 views', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_73590', '73590', 'CPT', 'X-ray tibia and fibula', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_73721', '73721', 'CPT', 'MRI knee without contrast', 'Radiology', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97110', '97110', 'CPT', 'Therapeutic exercises, each 15 minutes', 'Physical Therapy', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97112', '97112', 'CPT', 'Neuromuscular re-education, each 15 minutes', 'Physical Therapy', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97129', '97129', 'CPT', 'Therapeutic cognitive intervention, first 15 minutes', 'Physical Therapy', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97130', '97130', 'CPT', 'Therapeutic cognitive intervention, additional 15 minutes', 'Physical Therapy', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97140', '97140', 'CPT', 'Manual therapy techniques, each 15 minutes', 'Physical Therapy', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97530', '97530', 'CPT', 'Therapeutic activities, each 15 minutes', 'Physical Therapy', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_97542', '97542', 'CPT', 'Wheelchair management training, each 15 minutes', 'Physical Therapy', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_20552', '20552', 'CPT', 'Trigger point injection(s), 1 or 2 muscle(s)', 'Injection', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_62322', '62322', 'CPT', 'Lumbar epidural injection', 'Injection', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_64493', '64493', 'CPT', 'Facet joint injection, cervical/thoracic', 'Injection', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_20526', '20526', 'CPT', 'Carpal tunnel injection', 'Injection', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_22600', '22600', 'CPT', 'Arthrodesis (fusion), posterior, cervical', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_22612', '22612', 'CPT', 'Arthrodesis (fusion), posterior, lumbar', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_63001', '63001', 'CPT', 'Laminectomy, 1 or 2 segments, cervical', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_63030', '63030', 'CPT', 'Lumbar discectomy, single interspace', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_25605', '25605', 'CPT', 'Closed treatment of distal radial fracture', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_27236', '27236', 'CPT', 'Open treatment of femoral fracture', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_27427', '27427', 'CPT', 'Ligamentous reconstruction (ACL), knee', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_27814', '27814', 'CPT', 'Open treatment of bimalleolar ankle fracture', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_29075', '29075', 'CPT', 'Application of forearm cast', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_61304', '61304', 'CPT', 'Craniectomy for hematoma evacuation', 'Surgery', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_21431', '21431', 'CPT', 'Open treatment of mandible fracture', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_21385', '21385', 'CPT', 'Open treatment of orbital fracture', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_12001', '12001', 'CPT', 'Simple wound repair, up to 2.5 cm', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_12051', '12051', 'CPT', 'Layer closure of wounds, face, up to 2.5 cm', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_14060', '14060', 'CPT', 'Tissue rearrangement, eyelids/nose/ears/lips', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_15100', '15100', 'CPT', 'Split-thickness skin graft, trunk/arms/legs', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_15120', '15120', 'CPT', 'Split-thickness skin graft, face/scalp/neck', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_16020', '16020', 'CPT', 'Burn dressing/debridement, small', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_16025', '16025', 'CPT', 'Burn dressing/debridement, medium', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_16030', '16030', 'CPT', 'Burn dressing/debridement, large', 'Surgery', 'Integumentary', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_32440', '32440', 'CPT', 'Pneumonectomy', 'Surgery', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_32484', '32484', 'CPT', 'Pleurectomy/decortication', 'Surgery', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_32551', '32551', 'CPT', 'Chest tube insertion', 'Surgery', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_38115', '38115', 'CPT', 'Splenectomy', 'Surgery', 'Hemic/Lymphatic', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_44600', '44600', 'CPT', 'Closure of enterostomy / intestinal repair', 'Surgery', 'Digestive', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_47360', '47360', 'CPT', 'Hepatic repair / liver laceration management', 'Surgery', 'Digestive', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_23412', '23412', 'CPT', 'Rotator cuff repair', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_23430', '23430', 'CPT', 'Shoulder tenodesis', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_29881', '29881', 'CPT', 'Knee arthroscopy with meniscectomy', 'Surgery', 'Musculoskeletal', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_64721', '64721', 'CPT', 'Carpal tunnel release', 'Surgery', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_65205', '65205', 'CPT', 'Eye foreign body removal, external', 'Surgery', 'Eye', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_65222', '65222', 'CPT', 'Corneal foreign body removal', 'Surgery', 'Eye', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_65710', '65710', 'CPT', 'Corneal transplant', 'Surgery', 'Eye', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_94010', '94010', 'CPT', 'Spirometry / pulmonary function test', 'Diagnostic', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_94060', '94060', 'CPT', 'Bronchodilator response testing', 'Diagnostic', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_95907', '95907', 'CPT', 'Nerve conduction study, 1-2 nerves', 'Diagnostic', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_95886', '95886', 'CPT', 'EMG needle examination, complete', 'Diagnostic', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_96116', '96116', 'CPT', 'Neurobehavioral status examination, first hour', 'Diagnostic', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_90837', '90837', 'CPT', 'Psychotherapy, 53+ minutes', 'Mental Health', 'Nervous', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_83655', '83655', 'CPT', 'Blood lead level', 'Laboratory', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_36430', '36430', 'CPT', 'Blood transfusion', 'Transfusion', 'Hemic/Lymphatic', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_94640', '94640', 'CPT', 'Nebulizer treatment', 'Respiratory Therapy', 'Respiratory', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_96365', '96365', 'CPT', 'IV infusion therapy, first hour', 'Infusion', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_96413', '96413', 'CPT', 'Chemotherapy IV infusion, first hour', 'Oncology', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_77385', '77385', 'CPT', 'Intensity modulated radiation treatment (IMRT)', 'Radiation Oncology', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_78816', '78816', 'CPT', 'PET/CT scan', 'Nuclear Medicine', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_90471', '90471', 'CPT', 'Immunization administration', 'Immunization', 'General', 2026, 'SEED');
INSERT OR REPLACE INTO medical_procedures (id, code, code_type, description, category, body_system, effective_year, source_dataset)
  VALUES ('proc_E1390', 'E1390', 'HCPCS', 'Power wheelchair', 'DME', 'Musculoskeletal', 2026, 'SEED');

-- ============================================================================
-- Medicare Rates (CY 2026 estimates)
-- ============================================================================
UPDATE medical_procedures SET
  work_rvu = 0.48, facility_pe_rvu = 0.4, non_fac_pe_rvu = 1.3,
  malpractice_rvu = 0.06, national_facility_rate = 30.41,
  national_non_fac_rate = 59.52, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99281' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.93, facility_pe_rvu = 0.58, non_fac_pe_rvu = 1.87,
  malpractice_rvu = 0.12, national_facility_rate = 52.73,
  national_non_fac_rate = 94.46, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99282' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.6, facility_pe_rvu = 0.85, non_fac_pe_rvu = 2.65,
  malpractice_rvu = 0.22, national_facility_rate = 86.37,
  national_non_fac_rate = 144.6, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99283' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 2.74, facility_pe_rvu = 1.25, non_fac_pe_rvu = 3.67,
  malpractice_rvu = 0.38, national_facility_rate = 141.37,
  national_non_fac_rate = 219.66, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99284' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 3.8, facility_pe_rvu = 1.6, non_fac_pe_rvu = 4.75,
  malpractice_rvu = 0.52, national_facility_rate = 191.51,
  national_non_fac_rate = 293.41, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99285' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 4.5, facility_pe_rvu = 1.75, non_fac_pe_rvu = 4.75,
  malpractice_rvu = 0.64, national_facility_rate = 222.89,
  national_non_fac_rate = 319.94, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99291' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 2.25, facility_pe_rvu = 0.85, non_fac_pe_rvu = 2.15,
  malpractice_rvu = 0.32, national_facility_rate = 110.64,
  national_non_fac_rate = 152.69, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99292' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.3, facility_pe_rvu = 0.66, non_fac_pe_rvu = 1.78,
  malpractice_rvu = 0.11, national_facility_rate = 66.96,
  national_non_fac_rate = 103.2, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99213' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.92, facility_pe_rvu = 0.93, non_fac_pe_rvu = 2.38,
  malpractice_rvu = 0.17, national_facility_rate = 97.7,
  national_non_fac_rate = 144.6, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99214' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 2.8, facility_pe_rvu = 1.25, non_fac_pe_rvu = 3.15,
  malpractice_rvu = 0.26, national_facility_rate = 139.43,
  national_non_fac_rate = 200.89, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '99215' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.85, facility_pe_rvu = 1.1, non_fac_pe_rvu = 5.12,
  malpractice_rvu = 0.07, national_facility_rate = 65.35,
  national_non_fac_rate = 195.39, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '70450' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.13, facility_pe_rvu = 1.45, non_fac_pe_rvu = 8.32,
  malpractice_rvu = 0.09, national_facility_rate = 86.37,
  national_non_fac_rate = 308.61, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '70551' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.48, facility_pe_rvu = 2.05, non_fac_pe_rvu = 11.95,
  malpractice_rvu = 0.12, national_facility_rate = 118.08,
  national_non_fac_rate = 438.34, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '70553' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.22, facility_pe_rvu = 0.25, non_fac_pe_rvu = 1.48,
  malpractice_rvu = 0.03, national_facility_rate = 16.18,
  national_non_fac_rate = 55.97, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '72040' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.22, facility_pe_rvu = 0.27, non_fac_pe_rvu = 1.53,
  malpractice_rvu = 0.03, national_facility_rate = 16.82,
  national_non_fac_rate = 57.58, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '72100' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.13, facility_pe_rvu = 1.42, non_fac_pe_rvu = 8.45,
  malpractice_rvu = 0.09, national_facility_rate = 85.4,
  national_non_fac_rate = 312.82, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '72141' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.08, facility_pe_rvu = 1.38, non_fac_pe_rvu = 8.2,
  malpractice_rvu = 0.09, national_facility_rate = 82.49,
  national_non_fac_rate = 303.12, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '72146' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.13, facility_pe_rvu = 1.42, non_fac_pe_rvu = 8.32,
  malpractice_rvu = 0.09, national_facility_rate = 85.4,
  national_non_fac_rate = 308.61, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '72148' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.18, facility_pe_rvu = 0.2, non_fac_pe_rvu = 0.9,
  malpractice_rvu = 0.02, national_facility_rate = 12.94,
  national_non_fac_rate = 35.59, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '71045' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.24, facility_pe_rvu = 1.35, non_fac_pe_rvu = 6.85,
  malpractice_rvu = 0.09, national_facility_rate = 86.7,
  national_non_fac_rate = 264.62, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '71260' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.74, facility_pe_rvu = 1.65, non_fac_pe_rvu = 8.95,
  malpractice_rvu = 0.13, national_facility_rate = 113.87,
  national_non_fac_rate = 350.13, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '74178' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.22, facility_pe_rvu = 0.24, non_fac_pe_rvu = 1.4,
  malpractice_rvu = 0.03, national_facility_rate = 15.85,
  national_non_fac_rate = 53.38, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '73030' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.06, facility_pe_rvu = 1.3, non_fac_pe_rvu = 7.65,
  malpractice_rvu = 0.08, national_facility_rate = 78.93,
  national_non_fac_rate = 284.36, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '73221' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.17, facility_pe_rvu = 0.22, non_fac_pe_rvu = 1.25,
  malpractice_rvu = 0.02, national_facility_rate = 13.26,
  national_non_fac_rate = 46.58, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '73560' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.17, facility_pe_rvu = 0.22, non_fac_pe_rvu = 1.15,
  malpractice_rvu = 0.02, national_facility_rate = 13.26,
  national_non_fac_rate = 43.35, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '73590' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.06, facility_pe_rvu = 1.32, non_fac_pe_rvu = 7.85,
  malpractice_rvu = 0.08, national_facility_rate = 79.58,
  national_non_fac_rate = 290.83, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '73721' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.45, facility_pe_rvu = 0.18, non_fac_pe_rvu = 0.52,
  malpractice_rvu = 0.01, national_facility_rate = 20.7,
  national_non_fac_rate = 31.7, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97110' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.45, facility_pe_rvu = 0.18, non_fac_pe_rvu = 0.52,
  malpractice_rvu = 0.01, national_facility_rate = 20.7,
  national_non_fac_rate = 31.7, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97112' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.45, facility_pe_rvu = 0.18, non_fac_pe_rvu = 0.55,
  malpractice_rvu = 0.01, national_facility_rate = 20.7,
  national_non_fac_rate = 32.67, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97129' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.45, facility_pe_rvu = 0.14, non_fac_pe_rvu = 0.4,
  malpractice_rvu = 0.01, national_facility_rate = 19.41,
  national_non_fac_rate = 27.82, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97130' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.43, facility_pe_rvu = 0.17, non_fac_pe_rvu = 0.48,
  malpractice_rvu = 0.01, national_facility_rate = 19.73,
  national_non_fac_rate = 29.76, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97140' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.44, facility_pe_rvu = 0.17, non_fac_pe_rvu = 0.5,
  malpractice_rvu = 0.01, national_facility_rate = 20.06,
  national_non_fac_rate = 30.73, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97530' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.3, facility_pe_rvu = 0.12, non_fac_pe_rvu = 0.35,
  malpractice_rvu = 0.01, national_facility_rate = 13.91,
  national_non_fac_rate = 21.35, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '97542' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.66, facility_pe_rvu = 0.35, non_fac_pe_rvu = 0.95,
  malpractice_rvu = 0.04, national_facility_rate = 33.97,
  national_non_fac_rate = 53.38, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '20552' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.42, facility_pe_rvu = 1.15, non_fac_pe_rvu = 3.85,
  malpractice_rvu = 0.14, national_facility_rate = 87.67,
  national_non_fac_rate = 175.01, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '62322' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.27, facility_pe_rvu = 1.5, non_fac_pe_rvu = 5.55,
  malpractice_rvu = 0.13, national_facility_rate = 93.82,
  national_non_fac_rate = 224.83, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '64493' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 21.6, facility_pe_rvu = 11.25, non_fac_pe_rvu = NULL,
  malpractice_rvu = 3.85, national_facility_rate = 1187.25,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '22600' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 23.53, facility_pe_rvu = 12.15, non_fac_pe_rvu = NULL,
  malpractice_rvu = 4.85, national_facility_rate = 1311.15,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '22612' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 15.52, facility_pe_rvu = 8.45, non_fac_pe_rvu = NULL,
  malpractice_rvu = 2.78, national_facility_rate = 865.36,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '63001' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 13.18, facility_pe_rvu = 7.25, non_fac_pe_rvu = NULL,
  malpractice_rvu = 2.36, national_facility_rate = 737.26,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '63030' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 5.04, facility_pe_rvu = 1.85, non_fac_pe_rvu = 3.45,
  malpractice_rvu = 0.62, national_facility_rate = 242.95,
  national_non_fac_rate = 294.71, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '25605' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 18.37, facility_pe_rvu = 9.85, non_fac_pe_rvu = NULL,
  malpractice_rvu = 3.45, national_facility_rate = 1024.53,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '27236' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 13.28, facility_pe_rvu = 7.65, non_fac_pe_rvu = NULL,
  malpractice_rvu = 2.15, national_facility_rate = 746.64,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '27427' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 12.12, facility_pe_rvu = 6.95, non_fac_pe_rvu = NULL,
  malpractice_rvu = 2.05, national_facility_rate = 683.23,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '27814' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 26.28, facility_pe_rvu = 13.85, non_fac_pe_rvu = NULL,
  malpractice_rvu = 5.12, national_facility_rate = 1463.84,
  national_non_fac_rate = NULL, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '61304' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.67, facility_pe_rvu = 0.6, non_fac_pe_rvu = 1.55,
  malpractice_rvu = 0.08, national_facility_rate = 76.02,
  national_non_fac_rate = 106.76, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '90837' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 2.8, facility_pe_rvu = 0.92, non_fac_pe_rvu = 2.15,
  malpractice_rvu = 0.12, national_facility_rate = 124.22,
  national_non_fac_rate = 163.97, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '96116' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 1.51, facility_pe_rvu = 0.72, non_fac_pe_rvu = 2.15,
  malpractice_rvu = 0.13, national_facility_rate = 76.35,
  national_non_fac_rate = 122.61, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '12001' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 2.67, facility_pe_rvu = 1.05, non_fac_pe_rvu = 2.85,
  malpractice_rvu = 0.35, national_facility_rate = 131.66,
  national_non_fac_rate = 189.9, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '12051' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.4, facility_pe_rvu = 0.55, non_fac_pe_rvu = 3.25,
  malpractice_rvu = 0.02, national_facility_rate = 31.38,
  national_non_fac_rate = 118.72, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '36430' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.17, facility_pe_rvu = 0.14, non_fac_pe_rvu = 0.82,
  malpractice_rvu = 0.01, national_facility_rate = 10.35,
  national_non_fac_rate = 32.35, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '94010' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 0.49, facility_pe_rvu = 0.85, non_fac_pe_rvu = 4.35,
  malpractice_rvu = 0.03, national_facility_rate = 44.32,
  national_non_fac_rate = 157.54, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '96413' AND effective_year = 2026;
UPDATE medical_procedures SET
  work_rvu = 2.46, facility_pe_rvu = 2.85, non_fac_pe_rvu = 15.85,
  malpractice_rvu = 0.18, national_facility_rate = 177.6,
  national_non_fac_rate = 598.15, conversion_factor = 32.35, source_dataset = 'CMS_PFS'
  WHERE code = '78816' AND effective_year = 2026;

-- ============================================================================
-- Injury Categories
-- ============================================================================
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_whiplash-cervical-strain', 'Whiplash / Cervical Strain', 'whiplash-cervical-strain', 'Soft tissue injury to the neck caused by rapid back-and-forth movement of the head, most common in rear-end collisions. Can range from mild strain to chronic pain requiring extensive treatment.', 'Cervical Spine', 'S13.4', 'S13.4', '["S13.4XXA","S13.4XXD","S13.4XXS","S16.1XXA","M54.2"]', 'MOTOR_VEHICLE', '["Rear-end collision","Side impact","T-bone collision"]', 2000, 5000, 5000, 15000, 15000, 50000, 50000, 150000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_traumatic-brain-injury', 'Traumatic Brain Injury (TBI)', 'traumatic-brain-injury', 'Brain injury caused by a bump, blow, or jolt to the head, or penetrating head injury. Ranges from mild concussion to severe TBI with permanent disability. Leading cause of death and disability in motor vehicle crashes.', 'Head / Brain', 'S06.0', 'S06.9', '["S06.0X0A","S06.0X1A","S06.1X0A","S06.2X0A","S06.300A","S06.4X0A","S06.5X0A","S06.6X0A","S06.890A","S06.9X0A"]', 'MOTOR_VEHICLE', '["Head impact in collision","Rollover crash","Pedestrian struck","Motorcycle crash"]', 5000, 25000, 25000, 100000, 100000, 500000, 500000, 3000000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_lumbar-thoracic-spine-injury', 'Lumbar / Thoracic Spine Injury', 'lumbar-thoracic-spine-injury', 'Injury to the mid or lower back including disc herniation, vertebral fractures, and spinal stenosis. Common in high-impact collisions and can lead to chronic pain or disability.', 'Thoracic / Lumbar Spine', 'S22.0', 'S33.9', '["S22.000A","S32.000A","S33.100A","M51.16","M51.17","M54.5","M54.41","M54.42"]', 'MOTOR_VEHICLE', '["High-speed collision","Rollover","Ejection from vehicle","T-bone collision"]', 3000, 10000, 10000, 50000, 50000, 150000, 100000, 500000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_spinal-cord-injury', 'Spinal Cord Injury', 'spinal-cord-injury', 'Damage to the spinal cord resulting in partial or complete loss of motor and/or sensory function. Can result in paraplegia or quadriplegia. One of the most catastrophic and costly injury types.', 'Spinal Cord', 'S14.0', 'S34.9', '["S14.101A","S14.109A","S24.101A","S24.109A","S34.101A","S34.109A","G82.20","G82.50"]', 'MOTOR_VEHICLE', '["High-speed collision","Rollover","Ejection","Motorcycle crash","Diving accident"]', 50000, 100000, 200000, 500000, 500000, 1500000, 1500000, 5000000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_extremity-fractures', 'Extremity Fractures', 'extremity-fractures', 'Broken bones in the arms, legs, hands, or feet. Among the most common injuries in motor vehicle crashes, ranging from simple fractures requiring casting to complex fractures needing surgical fixation.', 'Upper / Lower Extremity', 'S42.0', 'S92.9', '["S42.001A","S52.001A","S62.001A","S72.001A","S82.001A","S92.001A","S42.201A","S52.501A","S72.301A","S82.101A"]', 'MOTOR_VEHICLE', '["Impact with steering wheel/dashboard","Pedestrian struck","Motorcycle crash","Ejection","Side impact"]', 3000, 8000, 8000, 35000, 35000, 100000, 50000, 300000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_rib-chest-fractures', 'Rib / Chest Fractures', 'rib-chest-fractures', 'Fractures of the ribs, sternum, or flail chest. Often caused by seatbelt/steering wheel impact. Can be complicated by pneumothorax or internal organ damage.', 'Chest / Thorax', 'S22.2', 'S22.9', '["S22.31XA","S22.32XA","S22.39XA","S22.41XA","S22.42XA","S22.49XA","S22.20XA","S27.0XXA"]', 'MOTOR_VEHICLE', '["Seatbelt impact","Steering wheel impact","Side impact","Pedestrian struck"]', 2000, 6000, 6000, 25000, 25000, 100000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_internal-organ-injuries', 'Internal Organ Injuries', 'internal-organ-injuries', 'Damage to internal abdominal or thoracic organs including spleen, liver, kidneys, and lungs. Often life-threatening and requiring emergency surgery.', 'Abdomen / Thorax', 'S36.0', 'S37.9', '["S36.020A","S36.113A","S36.030A","S37.001A","S37.011A","S27.301A","S27.321A"]', 'MOTOR_VEHICLE', '["High-speed collision","Seatbelt compression","Steering wheel impact","Pedestrian struck"]', 15000, 40000, 40000, 120000, 120000, 500000, 200000, 1000000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_soft-tissue-contusions', 'Soft Tissue / Contusions', 'soft-tissue-contusions', 'Bruises, sprains, strains, and other soft tissue injuries. Most common injury type in motor vehicle crashes. Usually resolves with conservative treatment.', 'Multiple', NULL, NULL, '["S00.93XA","S10.93XA","S20.219A","S30.0XXA","S40.011A","S60.011A","S70.011A","S80.011A","S90.011A"]', 'MOTOR_VEHICLE', '["Any collision type","Seatbelt bruising","Airbag deployment","Impact with vehicle interior"]', 500, 2000, 2000, 8000, 8000, 20000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_knee-ligament-tears', 'Knee Ligament Tears (ACL/MCL/PCL)', 'knee-ligament-tears', 'Tears of the anterior cruciate, medial collateral, or posterior cruciate ligaments. Dashboard impact injuries are a common mechanism in frontal collisions.', 'Knee', NULL, NULL, '["S83.511A","S83.512A","S83.401A","S83.402A","S83.201A","S83.202A","M23.611","M23.612"]', 'MOTOR_VEHICLE', '["Dashboard impact (PCL)","Frontal collision","Pedestrian struck","Motorcycle crash"]', 3000, 8000, 8000, 25000, 25000, 60000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_shoulder-injuries', 'Shoulder Injuries', 'shoulder-injuries', 'Rotator cuff tears, dislocations, clavicle fractures, and labral tears from seatbelt restraint or direct impact.', 'Shoulder', NULL, NULL, '["S43.001A","S43.401A","S42.001A","S42.011A","S46.011A","M75.110","M75.120"]', 'MOTOR_VEHICLE', '["Seatbelt restraint injury","Side impact","Arm bracing on steering wheel","Ejection"]', 2000, 6000, 6000, 25000, 25000, 60000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_facial-jaw-fractures', 'Facial / Jaw Fractures', 'facial-jaw-fractures', 'Fractures of the facial bones, orbits, nasal bones, or mandible/maxilla. Often caused by airbag deployment, windshield impact, or steering wheel.', 'Face / Jaw', NULL, NULL, '["S02.0XXA","S02.2XXA","S02.3XXA","S02.400A","S02.600A","S02.8XXA"]', 'MOTOR_VEHICLE', '["Windshield impact","Airbag deployment","Steering wheel impact","Unrestrained occupant"]', 3000, 10000, 10000, 40000, 40000, 150000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_burns', 'Burns (Thermal / Chemical)', 'burns', 'Burn injuries from vehicle fires, fuel ignition, chemical exposure, or airbag burns. Severity ranges from superficial to full-thickness burns requiring grafting.', 'Multiple / Skin', 'T20', 'T32', '["T20.00XA","T21.00XA","T22.00XA","T23.001A","T24.001A","T25.001A","T31.0"]', 'MOTOR_VEHICLE', '["Vehicle fire","Fuel ignition","Airbag chemical burn","Hot surface contact","Chemical spill"]', 5000, 15000, 15000, 75000, 75000, 500000, 200000, 2000000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_chemical-inhalation-injury', 'Chemical Inhalation Injury', 'chemical-inhalation-injury', 'Respiratory tract injury from inhaling toxic fumes, gases, or particulates. Can result in acute respiratory distress, chemical pneumonitis, or chronic lung disease.', 'Respiratory System', 'T59', 'T59.9', '["T59.891A","T59.4X1A","J68.0","J68.1","J68.2","J68.3","J68.4","J68.8","J68.9"]', 'TOXIC_EXPOSURE', '["Industrial chemical exposure","Vehicle fire fumes","Hazmat spill from truck crash","Workplace exposure"]', 3000, 10000, 10000, 50000, 50000, 200000, 100000, 500000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_asbestos-mesothelioma', 'Asbestos / Mesothelioma', 'asbestos-mesothelioma', 'Malignant mesothelioma caused by asbestos exposure. Extremely aggressive cancer with poor prognosis and very high treatment costs. Long latency period (20-50 years).', 'Pleura / Peritoneum', NULL, NULL, '["C45.0","C45.1","C45.2","C45.7","C45.9","J92.0"]', 'TOXIC_EXPOSURE', '["Occupational asbestos exposure","Building demolition","Ship/auto brake lining exposure","Environmental exposure"]', NULL, NULL, NULL, NULL, 150000, 500000, 500000, 2500000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_lead-poisoning', 'Lead Poisoning', 'lead-poisoning', 'Toxic effects of lead exposure causing neurological, renal, and hematological damage. Particularly dangerous for children. Often results from environmental contamination.', 'Systemic / Neurological', NULL, NULL, '["T56.0X1A","T56.0X2A","T56.0X4A"]', 'TOXIC_EXPOSURE', '["Lead paint exposure","Contaminated water","Industrial exposure","Battery recycling"]', 2000, 8000, 8000, 30000, 30000, 100000, 50000, 500000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_chemical-burns', 'Chemical Burns (Skin/Eyes)', 'chemical-burns', 'Burns caused by contact with corrosive chemicals including acids, alkalis, and other industrial chemicals. Eye involvement can cause permanent vision loss.', 'Skin / Eyes', NULL, NULL, '["T54.0X1A","T54.1X1A","T54.2X1A","T54.3X1A","T26.50XA","T26.60XA"]', 'TOXIC_EXPOSURE', '["Industrial chemical spill","Hazmat truck crash","Battery acid exposure","Cleaning chemical contact"]', 3000, 12000, 12000, 50000, 50000, 250000, 100000, 750000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_slip-and-fall', 'Slip and Fall Injuries', 'slip-and-fall', 'Injuries resulting from falls on the same level, typically in commercial or public spaces. Common basis for premises liability claims.', 'Multiple', NULL, NULL, '["W01.0XXA","W01.10XA","W01.110A","W01.190A","W00.0XXA","W18.00XA"]', 'GENERAL', '["Wet floors","Ice/snow","Uneven surfaces","Poor lighting","Loose rugs/mats"]', 1000, 5000, 5000, 25000, 25000, 100000, 50000, 500000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_dog-bite-injuries', 'Dog Bite Injuries', 'dog-bite-injuries', 'Bite wounds and related injuries from dog attacks. Can cause severe lacerations, infections, nerve damage, and psychological trauma.', 'Multiple / Skin', NULL, NULL, '["W54.0XXA","W54.1XXA","S01.80XA","S01.81XA","S51.801A","S61.001A","S81.001A"]', 'GENERAL', '["Unprovoked dog attack","Postal worker attack","Neighbor dog bite","Stray/feral dog"]', 1000, 5000, 5000, 20000, 20000, 100000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_repetitive-strain-workplace', 'Repetitive Strain / Workplace Ergonomic Injuries', 'repetitive-strain-workplace', 'Cumulative trauma disorders including carpal tunnel syndrome, tendinitis, and other injuries from repetitive workplace activities.', 'Upper Extremity / Wrist', NULL, NULL, '["G56.00","G56.01","G56.02","M65.4","M65.811","M65.812","M77.10","M77.11"]', 'WORKPLACE', '["Repetitive typing","Assembly line work","Vibrating tools","Poor ergonomics"]', 1000, 5000, 5000, 15000, 15000, 40000, NULL, NULL);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_construction-fall-injuries', 'Construction Fall Injuries', 'construction-fall-injuries', 'Injuries from falls at height in construction settings. The leading cause of death in construction industry. Often involves multiple trauma.', 'Multiple', NULL, NULL, '["W12.XXXA","W11.XXXA","W13.0XXA","W13.2XXA","W13.8XXA","W17.89XA"]', 'WORKPLACE', '["Scaffold fall","Ladder fall","Roof fall","Elevated platform fall"]', 5000, 15000, 15000, 75000, 75000, 300000, 200000, 2000000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_pedestrian-impact-injuries', 'Pedestrian Impact Injuries', 'pedestrian-impact-injuries', 'Injuries sustained by pedestrians struck by motor vehicles. Typically involve multiple body regions with high severity due to lack of protection.', 'Multiple', NULL, NULL, '["V03.10XA","V03.90XA","V04.10XA","V04.90XA","V09.20XA"]', 'PEDESTRIAN', '["Crosswalk collision","Pedestrian in roadway","Parking lot","Intersection"]', 5000, 15000, 15000, 75000, 75000, 500000, 300000, 3000000);
INSERT OR REPLACE INTO injury_categories (id, name, slug, description, body_region, icd10_code_start, icd10_code_end, icd10_codes, crash_relevance, common_causes, mild_cost_low, mild_cost_high, moderate_cost_low, moderate_cost_high, severe_cost_low, severe_cost_high, lifetime_cost_low, lifetime_cost_high)
  VALUES ('inj_bicycle-crash-injuries', 'Bicycle Crash Injuries', 'bicycle-crash-injuries', 'Injuries to cyclists struck by motor vehicles or in bicycle crashes. Road rash, fractures, and head injuries are common.', 'Multiple', NULL, NULL, '["V13.4XXA","V13.9XXA","V19.60XA","V19.9XXA"]', 'BICYCLE', '["Car-bicycle collision","Dooring","Intersection collision","Right hook"]', 3000, 10000, 10000, 50000, 50000, 300000, 200000, 2000000);

-- ============================================================================
-- Injury-Procedure Mappings
-- ============================================================================
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_99213_ACUTE', 'inj_whiplash-cervical-strain', 'proc_99213', 'ACUTE', 1, 4, 'Biweekly x 8 weeks', 'Follow-up office visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_99283_EMERGENCY', 'inj_whiplash-cervical-strain', 'proc_99283', 'EMERGENCY', 1, 1, 'Once', 'Initial ER visit - moderate');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_72141_ACUTE', 'inj_whiplash-cervical-strain', 'proc_72141', 'ACUTE', 1, 1, 'Once', 'MRI cervical spine without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_72040_EMERGENCY', 'inj_whiplash-cervical-strain', 'proc_72040', 'EMERGENCY', 1, 1, 'Once', 'X-ray cervical spine 2-3 views');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_97110_REHABILITATION', 'inj_whiplash-cervical-strain', 'proc_97110', 'REHABILITATION', 1, 24, '2-3x/week x 8-12 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_97140_REHABILITATION', 'inj_whiplash-cervical-strain', 'proc_97140', 'REHABILITATION', 1, 24, '2-3x/week x 8-12 weeks', 'Manual therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_97112_REHABILITATION', 'inj_whiplash-cervical-strain', 'proc_97112', 'REHABILITATION', 1, 12, '2x/week x 6 weeks', 'Neuromuscular re-education');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_20552_ACUTE', 'inj_whiplash-cervical-strain', 'proc_20552', 'ACUTE', 0, 3, 'Every 2-4 weeks', 'Trigger point injections');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_whiplash-cervical-strain_64493_CHRONIC', 'inj_whiplash-cervical-strain', 'proc_64493', 'CHRONIC', 0, 2, 'Every 6 months', 'Facet joint injection - cervical');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_99285_EMERGENCY', 'inj_traumatic-brain-injury', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_99291_EMERGENCY', 'inj_traumatic-brain-injury', 'proc_99291', 'EMERGENCY', 0, 1, 'Once', 'Critical care first 30-74 min');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_70450_EMERGENCY', 'inj_traumatic-brain-injury', 'proc_70450', 'EMERGENCY', 1, 1, 'Once', 'CT head without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_70551_ACUTE', 'inj_traumatic-brain-injury', 'proc_70551', 'ACUTE', 1, 1, 'Once', 'MRI brain without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_70553_ACUTE', 'inj_traumatic-brain-injury', 'proc_70553', 'ACUTE', 0, 1, 'Once', 'MRI brain with and without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_96116_REHABILITATION', 'inj_traumatic-brain-injury', 'proc_96116', 'REHABILITATION', 1, 1, 'Once', 'Neurobehavioral status exam first hour');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_97129_REHABILITATION', 'inj_traumatic-brain-injury', 'proc_97129', 'REHABILITATION', 1, 36, '3x/week x 12 weeks', 'Cognitive function intervention first 15 min');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_97130_REHABILITATION', 'inj_traumatic-brain-injury', 'proc_97130', 'REHABILITATION', 1, 36, '3x/week x 12 weeks', 'Cognitive function intervention additional 15 min');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_97110_REHABILITATION', 'inj_traumatic-brain-injury', 'proc_97110', 'REHABILITATION', 1, 24, '2x/week x 12 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_90837_CHRONIC', 'inj_traumatic-brain-injury', 'proc_90837', 'CHRONIC', 1, 24, 'Weekly x 6 months', 'Psychotherapy 53+ minutes');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_traumatic-brain-injury_61304_SURGICAL', 'inj_traumatic-brain-injury', 'proc_61304', 'SURGICAL', 0, 1, 'Once', 'Craniectomy for hematoma evacuation');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_99284_EMERGENCY', 'inj_lumbar-thoracic-spine-injury', 'proc_99284', 'EMERGENCY', 1, 1, 'Once', 'ER visit - moderate-high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_72148_ACUTE', 'inj_lumbar-thoracic-spine-injury', 'proc_72148', 'ACUTE', 1, 1, 'Once', 'MRI lumbar spine without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_72146_ACUTE', 'inj_lumbar-thoracic-spine-injury', 'proc_72146', 'ACUTE', 1, 1, 'Once', 'MRI thoracic spine without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_72100_EMERGENCY', 'inj_lumbar-thoracic-spine-injury', 'proc_72100', 'EMERGENCY', 1, 1, 'Once', 'X-ray lumbar spine 2-3 views');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_97110_REHABILITATION', 'inj_lumbar-thoracic-spine-injury', 'proc_97110', 'REHABILITATION', 1, 30, '3x/week x 10 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_97140_REHABILITATION', 'inj_lumbar-thoracic-spine-injury', 'proc_97140', 'REHABILITATION', 1, 20, '2x/week x 10 weeks', 'Manual therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_62322_ACUTE', 'inj_lumbar-thoracic-spine-injury', 'proc_62322', 'ACUTE', 0, 3, 'Every 2-4 weeks', 'Lumbar epidural injection');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_63030_SURGICAL', 'inj_lumbar-thoracic-spine-injury', 'proc_63030', 'SURGICAL', 0, 1, 'Once', 'Lumbar discectomy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lumbar-thoracic-spine-injury_22612_SURGICAL', 'inj_lumbar-thoracic-spine-injury', 'proc_22612', 'SURGICAL', 0, 1, 'Once', 'Lumbar spinal fusion');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_99291_EMERGENCY', 'inj_spinal-cord-injury', 'proc_99291', 'EMERGENCY', 1, 1, 'Once', 'Critical care first 30-74 min');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_99292_EMERGENCY', 'inj_spinal-cord-injury', 'proc_99292', 'EMERGENCY', 1, 3, 'Same day', 'Critical care additional 30 min');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_72141_EMERGENCY', 'inj_spinal-cord-injury', 'proc_72141', 'EMERGENCY', 1, 1, 'Once', 'MRI cervical spine');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_72148_EMERGENCY', 'inj_spinal-cord-injury', 'proc_72148', 'EMERGENCY', 1, 1, 'Once', 'MRI lumbar spine');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_63001_SURGICAL', 'inj_spinal-cord-injury', 'proc_63001', 'SURGICAL', 1, 1, 'Once', 'Laminectomy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_22600_SURGICAL', 'inj_spinal-cord-injury', 'proc_22600', 'SURGICAL', 0, 1, 'Once', 'Cervical spinal fusion');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_97110_REHABILITATION', 'inj_spinal-cord-injury', 'proc_97110', 'REHABILITATION', 1, 100, '5x/week x 20 weeks', 'Therapeutic exercises - intensive');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_97542_REHABILITATION', 'inj_spinal-cord-injury', 'proc_97542', 'REHABILITATION', 1, 50, '5x/week x 10 weeks', 'Wheelchair management training');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_97530_REHABILITATION', 'inj_spinal-cord-injury', 'proc_97530', 'REHABILITATION', 1, 50, '5x/week x 10 weeks', 'Therapeutic activities');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_spinal-cord-injury_E1390_LIFETIME', 'inj_spinal-cord-injury', 'proc_E1390', 'LIFETIME', 1, 1, 'Every 5 years', 'Power wheelchair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_99283_EMERGENCY', 'inj_extremity-fractures', 'proc_99283', 'EMERGENCY', 1, 1, 'Once', 'ER visit - moderate');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_73030_EMERGENCY', 'inj_extremity-fractures', 'proc_73030', 'EMERGENCY', 1, 1, 'Once', 'X-ray shoulder/upper extremity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_73560_EMERGENCY', 'inj_extremity-fractures', 'proc_73560', 'EMERGENCY', 1, 1, 'Once', 'X-ray knee');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_73590_EMERGENCY', 'inj_extremity-fractures', 'proc_73590', 'EMERGENCY', 1, 1, 'Once', 'X-ray tibia/fibula');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_25605_ACUTE', 'inj_extremity-fractures', 'proc_25605', 'ACUTE', 1, 1, 'Once', 'Closed treatment distal radius fracture');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_27236_SURGICAL', 'inj_extremity-fractures', 'proc_27236', 'SURGICAL', 0, 1, 'Once', 'Open treatment femoral fracture');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_27814_SURGICAL', 'inj_extremity-fractures', 'proc_27814', 'SURGICAL', 0, 1, 'Once', 'Open treatment bimalleolar ankle fracture');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_29075_ACUTE', 'inj_extremity-fractures', 'proc_29075', 'ACUTE', 1, 1, 'Once', 'Application of forearm cast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_97110_REHABILITATION', 'inj_extremity-fractures', 'proc_97110', 'REHABILITATION', 1, 18, '3x/week x 6 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_extremity-fractures_97530_REHABILITATION', 'inj_extremity-fractures', 'proc_97530', 'REHABILITATION', 1, 12, '2x/week x 6 weeks', 'Therapeutic activities');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_rib-chest-fractures_99284_EMERGENCY', 'inj_rib-chest-fractures', 'proc_99284', 'EMERGENCY', 1, 1, 'Once', 'ER visit - moderate-high');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_rib-chest-fractures_71045_EMERGENCY', 'inj_rib-chest-fractures', 'proc_71045', 'EMERGENCY', 1, 1, 'Once', 'Chest X-ray single view');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_rib-chest-fractures_71260_EMERGENCY', 'inj_rib-chest-fractures', 'proc_71260', 'EMERGENCY', 0, 1, 'Once', 'CT chest with contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_rib-chest-fractures_32551_SURGICAL', 'inj_rib-chest-fractures', 'proc_32551', 'SURGICAL', 0, 1, 'Once', 'Chest tube insertion');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_rib-chest-fractures_99213_ACUTE', 'inj_rib-chest-fractures', 'proc_99213', 'ACUTE', 1, 3, 'Weekly x 3 weeks', 'Follow-up visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_rib-chest-fractures_97110_REHABILITATION', 'inj_rib-chest-fractures', 'proc_97110', 'REHABILITATION', 1, 12, '2x/week x 6 weeks', 'Breathing exercises / rehab');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_99285_EMERGENCY', 'inj_internal-organ-injuries', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_99291_EMERGENCY', 'inj_internal-organ-injuries', 'proc_99291', 'EMERGENCY', 1, 1, 'Once', 'Critical care first hour');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_74178_EMERGENCY', 'inj_internal-organ-injuries', 'proc_74178', 'EMERGENCY', 1, 1, 'Once', 'CT abdomen/pelvis with contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_36430_EMERGENCY', 'inj_internal-organ-injuries', 'proc_36430', 'EMERGENCY', 1, 2, 'As needed', 'Blood transfusion');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_44600_SURGICAL', 'inj_internal-organ-injuries', 'proc_44600', 'SURGICAL', 0, 1, 'Once', 'Repair of intestinal injury');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_38115_SURGICAL', 'inj_internal-organ-injuries', 'proc_38115', 'SURGICAL', 0, 1, 'Once', 'Splenectomy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_internal-organ-injuries_47360_SURGICAL', 'inj_internal-organ-injuries', 'proc_47360', 'SURGICAL', 0, 1, 'Once', 'Hepatic repair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_soft-tissue-contusions_99282_EMERGENCY', 'inj_soft-tissue-contusions', 'proc_99282', 'EMERGENCY', 1, 1, 'Once', 'ER visit - low-moderate');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_soft-tissue-contusions_99213_ACUTE', 'inj_soft-tissue-contusions', 'proc_99213', 'ACUTE', 1, 2, 'Biweekly', 'Follow-up office visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_soft-tissue-contusions_97110_REHABILITATION', 'inj_soft-tissue-contusions', 'proc_97110', 'REHABILITATION', 1, 12, '2x/week x 6 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_soft-tissue-contusions_97140_REHABILITATION', 'inj_soft-tissue-contusions', 'proc_97140', 'REHABILITATION', 1, 8, '2x/week x 4 weeks', 'Manual therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_99284_EMERGENCY', 'inj_knee-ligament-tears', 'proc_99284', 'EMERGENCY', 1, 1, 'Once', 'ER visit');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_73721_ACUTE', 'inj_knee-ligament-tears', 'proc_73721', 'ACUTE', 1, 1, 'Once', 'MRI knee without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_73560_EMERGENCY', 'inj_knee-ligament-tears', 'proc_73560', 'EMERGENCY', 1, 1, 'Once', 'X-ray knee');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_27427_SURGICAL', 'inj_knee-ligament-tears', 'proc_27427', 'SURGICAL', 1, 1, 'Once', 'ACL reconstruction');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_29881_SURGICAL', 'inj_knee-ligament-tears', 'proc_29881', 'SURGICAL', 0, 1, 'Once', 'Knee arthroscopy with meniscectomy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_97110_REHABILITATION', 'inj_knee-ligament-tears', 'proc_97110', 'REHABILITATION', 1, 36, '3x/week x 12 weeks', 'Therapeutic exercises - post-op');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_knee-ligament-tears_97530_REHABILITATION', 'inj_knee-ligament-tears', 'proc_97530', 'REHABILITATION', 1, 18, '3x/week x 6 weeks', 'Therapeutic activities');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_99283_EMERGENCY', 'inj_shoulder-injuries', 'proc_99283', 'EMERGENCY', 1, 1, 'Once', 'ER visit');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_73221_ACUTE', 'inj_shoulder-injuries', 'proc_73221', 'ACUTE', 1, 1, 'Once', 'MRI shoulder without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_73030_EMERGENCY', 'inj_shoulder-injuries', 'proc_73030', 'EMERGENCY', 1, 1, 'Once', 'X-ray shoulder');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_23412_SURGICAL', 'inj_shoulder-injuries', 'proc_23412', 'SURGICAL', 0, 1, 'Once', 'Rotator cuff repair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_23430_SURGICAL', 'inj_shoulder-injuries', 'proc_23430', 'SURGICAL', 0, 1, 'Once', 'Shoulder tenodesis');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_97110_REHABILITATION', 'inj_shoulder-injuries', 'proc_97110', 'REHABILITATION', 1, 24, '3x/week x 8 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_shoulder-injuries_97140_REHABILITATION', 'inj_shoulder-injuries', 'proc_97140', 'REHABILITATION', 1, 16, '2x/week x 8 weeks', 'Manual therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_facial-jaw-fractures_99284_EMERGENCY', 'inj_facial-jaw-fractures', 'proc_99284', 'EMERGENCY', 1, 1, 'Once', 'ER visit');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_facial-jaw-fractures_70150_EMERGENCY', 'inj_facial-jaw-fractures', 'proc_70150', 'EMERGENCY', 1, 1, 'Once', 'Facial bones X-ray');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_facial-jaw-fractures_70486_EMERGENCY', 'inj_facial-jaw-fractures', 'proc_70486', 'EMERGENCY', 1, 1, 'Once', 'CT maxillofacial without contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_facial-jaw-fractures_21431_SURGICAL', 'inj_facial-jaw-fractures', 'proc_21431', 'SURGICAL', 0, 1, 'Once', 'Open treatment mandible fracture');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_facial-jaw-fractures_21385_SURGICAL', 'inj_facial-jaw-fractures', 'proc_21385', 'SURGICAL', 0, 1, 'Once', 'Open treatment orbital fracture');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_facial-jaw-fractures_12051_EMERGENCY', 'inj_facial-jaw-fractures', 'proc_12051', 'EMERGENCY', 1, 1, 'Once', 'Facial laceration repair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_99285_EMERGENCY', 'inj_burns', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_16020_ACUTE', 'inj_burns', 'proc_16020', 'ACUTE', 1, 5, 'Every 2-3 days', 'Burn dressing change <5% TBSA');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_16025_ACUTE', 'inj_burns', 'proc_16025', 'ACUTE', 0, 5, 'Every 2-3 days', 'Burn dressing change medium');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_16030_ACUTE', 'inj_burns', 'proc_16030', 'ACUTE', 0, 5, 'Every 2-3 days', 'Burn dressing change large');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_15100_SURGICAL', 'inj_burns', 'proc_15100', 'SURGICAL', 0, 1, 'Once', 'Split-thickness skin graft');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_15120_SURGICAL', 'inj_burns', 'proc_15120', 'SURGICAL', 0, 1, 'Once', 'Split-thickness graft face/scalp');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_burns_97110_REHABILITATION', 'inj_burns', 'proc_97110', 'REHABILITATION', 1, 24, '3x/week x 8 weeks', 'Range of motion / scar management');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_99285_EMERGENCY', 'inj_chemical-inhalation-injury', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_71260_EMERGENCY', 'inj_chemical-inhalation-injury', 'proc_71260', 'EMERGENCY', 1, 1, 'Once', 'CT chest with contrast');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_94010_ACUTE', 'inj_chemical-inhalation-injury', 'proc_94010', 'ACUTE', 1, 3, 'At diagnosis, 1mo, 3mo', 'Spirometry/pulmonary function');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_94060_ACUTE', 'inj_chemical-inhalation-injury', 'proc_94060', 'ACUTE', 1, 2, 'At diagnosis, follow-up', 'Bronchodilator response testing');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_31622_ACUTE', 'inj_chemical-inhalation-injury', 'proc_31622', 'ACUTE', 0, 1, 'Once', 'Diagnostic bronchoscopy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_94640_ACUTE', 'inj_chemical-inhalation-injury', 'proc_94640', 'ACUTE', 1, 10, 'Multiple', 'Nebulizer treatment');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-inhalation-injury_99213_CHRONIC', 'inj_chemical-inhalation-injury', 'proc_99213', 'CHRONIC', 1, 6, 'Every 2 months', 'Follow-up pulmonology visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_99215_ACUTE', 'inj_asbestos-mesothelioma', 'proc_99215', 'ACUTE', 1, 12, 'Monthly', 'Oncology office visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_71260_ACUTE', 'inj_asbestos-mesothelioma', 'proc_71260', 'ACUTE', 1, 4, 'Quarterly', 'CT chest with contrast - staging');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_78816_ACUTE', 'inj_asbestos-mesothelioma', 'proc_78816', 'ACUTE', 1, 2, 'Every 6 months', 'PET/CT scan');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_32440_SURGICAL', 'inj_asbestos-mesothelioma', 'proc_32440', 'SURGICAL', 0, 1, 'Once', 'Pneumonectomy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_32484_SURGICAL', 'inj_asbestos-mesothelioma', 'proc_32484', 'SURGICAL', 0, 1, 'Once', 'Pleurectomy/decortication');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_96413_CHRONIC', 'inj_asbestos-mesothelioma', 'proc_96413', 'CHRONIC', 1, 18, 'Every 3 weeks x 54 weeks', 'Chemotherapy infusion');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_asbestos-mesothelioma_77385_CHRONIC', 'inj_asbestos-mesothelioma', 'proc_77385', 'CHRONIC', 0, 25, 'Daily x 5 weeks', 'Radiation therapy (IMRT)');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lead-poisoning_99214_ACUTE', 'inj_lead-poisoning', 'proc_99214', 'ACUTE', 1, 6, 'Monthly', 'Office visits with lead level monitoring');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lead-poisoning_83655_ACUTE', 'inj_lead-poisoning', 'proc_83655', 'ACUTE', 1, 6, 'Monthly', 'Blood lead level testing');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lead-poisoning_96365_ACUTE', 'inj_lead-poisoning', 'proc_96365', 'ACUTE', 0, 5, 'Daily x 5 days', 'Chelation therapy IV infusion');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lead-poisoning_96116_CHRONIC', 'inj_lead-poisoning', 'proc_96116', 'CHRONIC', 1, 2, 'At baseline and 6 months', 'Neuropsych evaluation');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_lead-poisoning_97129_REHABILITATION', 'inj_lead-poisoning', 'proc_97129', 'REHABILITATION', 1, 24, '2x/week x 12 weeks', 'Cognitive rehabilitation (children)');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-burns_99285_EMERGENCY', 'inj_chemical-burns', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-burns_16020_ACUTE', 'inj_chemical-burns', 'proc_16020', 'ACUTE', 1, 8, 'Every 2-3 days', 'Chemical burn dressing');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-burns_65205_EMERGENCY', 'inj_chemical-burns', 'proc_65205', 'EMERGENCY', 0, 1, 'Once', 'Eye foreign body removal / irrigation');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-burns_65222_EMERGENCY', 'inj_chemical-burns', 'proc_65222', 'EMERGENCY', 0, 1, 'Once', 'Corneal foreign body removal');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-burns_15100_SURGICAL', 'inj_chemical-burns', 'proc_15100', 'SURGICAL', 0, 1, 'Once', 'Skin graft');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_chemical-burns_65710_SURGICAL', 'inj_chemical-burns', 'proc_65710', 'SURGICAL', 0, 1, 'Once', 'Corneal transplant');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_slip-and-fall_99283_EMERGENCY', 'inj_slip-and-fall', 'proc_99283', 'EMERGENCY', 1, 1, 'Once', 'ER visit');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_slip-and-fall_73590_EMERGENCY', 'inj_slip-and-fall', 'proc_73590', 'EMERGENCY', 1, 1, 'Once', 'X-ray lower extremity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_slip-and-fall_99213_ACUTE', 'inj_slip-and-fall', 'proc_99213', 'ACUTE', 1, 3, 'Biweekly', 'Follow-up visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_slip-and-fall_97110_REHABILITATION', 'inj_slip-and-fall', 'proc_97110', 'REHABILITATION', 1, 18, '3x/week x 6 weeks', 'Physical therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_dog-bite-injuries_99283_EMERGENCY', 'inj_dog-bite-injuries', 'proc_99283', 'EMERGENCY', 1, 1, 'Once', 'ER visit');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_dog-bite-injuries_12001_EMERGENCY', 'inj_dog-bite-injuries', 'proc_12001', 'EMERGENCY', 1, 1, 'Once', 'Simple wound repair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_dog-bite-injuries_12051_EMERGENCY', 'inj_dog-bite-injuries', 'proc_12051', 'EMERGENCY', 0, 1, 'Once', 'Complex facial wound repair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_dog-bite-injuries_90471_EMERGENCY', 'inj_dog-bite-injuries', 'proc_90471', 'EMERGENCY', 1, 1, 'Once', 'Immunization administration (tetanus/rabies)');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_dog-bite-injuries_99214_ACUTE', 'inj_dog-bite-injuries', 'proc_99214', 'ACUTE', 1, 2, 'Weekly x 2 weeks', 'Follow-up wound checks');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_dog-bite-injuries_14060_SURGICAL', 'inj_dog-bite-injuries', 'proc_14060', 'SURGICAL', 0, 1, 'Once', 'Tissue rearrangement (facial scar)');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_repetitive-strain-workplace_99213_ACUTE', 'inj_repetitive-strain-workplace', 'proc_99213', 'ACUTE', 1, 4, 'Monthly', 'Office visits');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_repetitive-strain-workplace_95907_ACUTE', 'inj_repetitive-strain-workplace', 'proc_95907', 'ACUTE', 1, 1, 'Once', 'Nerve conduction study 1-2 nerves');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_repetitive-strain-workplace_95886_ACUTE', 'inj_repetitive-strain-workplace', 'proc_95886', 'ACUTE', 1, 1, 'Once', 'EMG needle examination');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_repetitive-strain-workplace_20526_ACUTE', 'inj_repetitive-strain-workplace', 'proc_20526', 'ACUTE', 0, 2, 'Every 3 months', 'Carpal tunnel injection');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_repetitive-strain-workplace_64721_SURGICAL', 'inj_repetitive-strain-workplace', 'proc_64721', 'SURGICAL', 0, 1, 'Once', 'Carpal tunnel release surgery');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_repetitive-strain-workplace_97110_REHABILITATION', 'inj_repetitive-strain-workplace', 'proc_97110', 'REHABILITATION', 1, 12, '2x/week x 6 weeks', 'Therapeutic exercises');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_99285_EMERGENCY', 'inj_construction-fall-injuries', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_99291_EMERGENCY', 'inj_construction-fall-injuries', 'proc_99291', 'EMERGENCY', 0, 1, 'Once', 'Critical care');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_74178_EMERGENCY', 'inj_construction-fall-injuries', 'proc_74178', 'EMERGENCY', 1, 1, 'Once', 'CT abdomen/pelvis');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_70450_EMERGENCY', 'inj_construction-fall-injuries', 'proc_70450', 'EMERGENCY', 1, 1, 'Once', 'CT head');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_72148_EMERGENCY', 'inj_construction-fall-injuries', 'proc_72148', 'EMERGENCY', 1, 1, 'Once', 'MRI lumbar spine');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_97110_REHABILITATION', 'inj_construction-fall-injuries', 'proc_97110', 'REHABILITATION', 1, 36, '3x/week x 12 weeks', 'Physical therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_construction-fall-injuries_97530_REHABILITATION', 'inj_construction-fall-injuries', 'proc_97530', 'REHABILITATION', 1, 24, '3x/week x 8 weeks', 'Therapeutic activities');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_pedestrian-impact-injuries_99285_EMERGENCY', 'inj_pedestrian-impact-injuries', 'proc_99285', 'EMERGENCY', 1, 1, 'Once', 'ER visit - high severity');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_pedestrian-impact-injuries_99291_EMERGENCY', 'inj_pedestrian-impact-injuries', 'proc_99291', 'EMERGENCY', 1, 1, 'Once', 'Critical care');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_pedestrian-impact-injuries_74178_EMERGENCY', 'inj_pedestrian-impact-injuries', 'proc_74178', 'EMERGENCY', 1, 1, 'Once', 'CT trauma abdomen/pelvis');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_pedestrian-impact-injuries_70450_EMERGENCY', 'inj_pedestrian-impact-injuries', 'proc_70450', 'EMERGENCY', 1, 1, 'Once', 'CT head');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_pedestrian-impact-injuries_71260_EMERGENCY', 'inj_pedestrian-impact-injuries', 'proc_71260', 'EMERGENCY', 1, 1, 'Once', 'CT chest');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_pedestrian-impact-injuries_97110_REHABILITATION', 'inj_pedestrian-impact-injuries', 'proc_97110', 'REHABILITATION', 1, 36, '3x/week x 12 weeks', 'Physical therapy');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_bicycle-crash-injuries_99284_EMERGENCY', 'inj_bicycle-crash-injuries', 'proc_99284', 'EMERGENCY', 1, 1, 'Once', 'ER visit');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_bicycle-crash-injuries_70450_EMERGENCY', 'inj_bicycle-crash-injuries', 'proc_70450', 'EMERGENCY', 1, 1, 'Once', 'CT head');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_bicycle-crash-injuries_12001_EMERGENCY', 'inj_bicycle-crash-injuries', 'proc_12001', 'EMERGENCY', 1, 1, 'Once', 'Road rash wound repair');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_bicycle-crash-injuries_73030_EMERGENCY', 'inj_bicycle-crash-injuries', 'proc_73030', 'EMERGENCY', 1, 1, 'Once', 'X-ray clavicle/shoulder');
INSERT OR REPLACE INTO injury_procedure_mappings (id, injury_id, procedure_id, phase, is_common, typical_qty, frequency, notes)
  VALUES ('map_bicycle-crash-injuries_97110_REHABILITATION', 'inj_bicycle-crash-injuries', 'proc_97110', 'REHABILITATION', 1, 18, '3x/week x 6 weeks', 'Physical therapy');

-- ============================================================================
-- Crash Severity Maps
-- ============================================================================
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_whiplash-cervical-strain_PROPERTY_DAMAGE_ONLY', 'inj_whiplash-cervical-strain', 'PROPERTY_DAMAGE_ONLY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_whiplash-cervical-strain_POSSIBLE_INJURY', 'inj_whiplash-cervical-strain', 'POSSIBLE_INJURY', 0.45);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_whiplash-cervical-strain_MINOR_INJURY', 'inj_whiplash-cervical-strain', 'MINOR_INJURY', 0.65);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_whiplash-cervical-strain_SERIOUS_INJURY', 'inj_whiplash-cervical-strain', 'SERIOUS_INJURY', 0.4);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_whiplash-cervical-strain_FATAL', 'inj_whiplash-cervical-strain', 'FATAL', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_traumatic-brain-injury_PROPERTY_DAMAGE_ONLY', 'inj_traumatic-brain-injury', 'PROPERTY_DAMAGE_ONLY', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_traumatic-brain-injury_POSSIBLE_INJURY', 'inj_traumatic-brain-injury', 'POSSIBLE_INJURY', 0.08);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_traumatic-brain-injury_MINOR_INJURY', 'inj_traumatic-brain-injury', 'MINOR_INJURY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_traumatic-brain-injury_SERIOUS_INJURY', 'inj_traumatic-brain-injury', 'SERIOUS_INJURY', 0.35);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_traumatic-brain-injury_FATAL', 'inj_traumatic-brain-injury', 'FATAL', 0.5);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_lumbar-thoracic-spine-injury_PROPERTY_DAMAGE_ONLY', 'inj_lumbar-thoracic-spine-injury', 'PROPERTY_DAMAGE_ONLY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_lumbar-thoracic-spine-injury_POSSIBLE_INJURY', 'inj_lumbar-thoracic-spine-injury', 'POSSIBLE_INJURY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_lumbar-thoracic-spine-injury_MINOR_INJURY', 'inj_lumbar-thoracic-spine-injury', 'MINOR_INJURY', 0.35);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_lumbar-thoracic-spine-injury_SERIOUS_INJURY', 'inj_lumbar-thoracic-spine-injury', 'SERIOUS_INJURY', 0.55);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_lumbar-thoracic-spine-injury_FATAL', 'inj_lumbar-thoracic-spine-injury', 'FATAL', 0.2);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_spinal-cord-injury_PROPERTY_DAMAGE_ONLY', 'inj_spinal-cord-injury', 'PROPERTY_DAMAGE_ONLY', 0);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_spinal-cord-injury_POSSIBLE_INJURY', 'inj_spinal-cord-injury', 'POSSIBLE_INJURY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_spinal-cord-injury_MINOR_INJURY', 'inj_spinal-cord-injury', 'MINOR_INJURY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_spinal-cord-injury_SERIOUS_INJURY', 'inj_spinal-cord-injury', 'SERIOUS_INJURY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_spinal-cord-injury_FATAL', 'inj_spinal-cord-injury', 'FATAL', 0.3);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_extremity-fractures_PROPERTY_DAMAGE_ONLY', 'inj_extremity-fractures', 'PROPERTY_DAMAGE_ONLY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_extremity-fractures_POSSIBLE_INJURY', 'inj_extremity-fractures', 'POSSIBLE_INJURY', 0.1);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_extremity-fractures_MINOR_INJURY', 'inj_extremity-fractures', 'MINOR_INJURY', 0.4);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_extremity-fractures_SERIOUS_INJURY', 'inj_extremity-fractures', 'SERIOUS_INJURY', 0.6);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_extremity-fractures_FATAL', 'inj_extremity-fractures', 'FATAL', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_rib-chest-fractures_PROPERTY_DAMAGE_ONLY', 'inj_rib-chest-fractures', 'PROPERTY_DAMAGE_ONLY', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_rib-chest-fractures_POSSIBLE_INJURY', 'inj_rib-chest-fractures', 'POSSIBLE_INJURY', 0.08);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_rib-chest-fractures_MINOR_INJURY', 'inj_rib-chest-fractures', 'MINOR_INJURY', 0.2);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_rib-chest-fractures_SERIOUS_INJURY', 'inj_rib-chest-fractures', 'SERIOUS_INJURY', 0.45);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_rib-chest-fractures_FATAL', 'inj_rib-chest-fractures', 'FATAL', 0.25);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_internal-organ-injuries_PROPERTY_DAMAGE_ONLY', 'inj_internal-organ-injuries', 'PROPERTY_DAMAGE_ONLY', 0);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_internal-organ-injuries_POSSIBLE_INJURY', 'inj_internal-organ-injuries', 'POSSIBLE_INJURY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_internal-organ-injuries_MINOR_INJURY', 'inj_internal-organ-injuries', 'MINOR_INJURY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_internal-organ-injuries_SERIOUS_INJURY', 'inj_internal-organ-injuries', 'SERIOUS_INJURY', 0.35);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_internal-organ-injuries_FATAL', 'inj_internal-organ-injuries', 'FATAL', 0.55);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_soft-tissue-contusions_PROPERTY_DAMAGE_ONLY', 'inj_soft-tissue-contusions', 'PROPERTY_DAMAGE_ONLY', 0.2);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_soft-tissue-contusions_POSSIBLE_INJURY', 'inj_soft-tissue-contusions', 'POSSIBLE_INJURY', 0.6);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_soft-tissue-contusions_MINOR_INJURY', 'inj_soft-tissue-contusions', 'MINOR_INJURY', 0.8);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_soft-tissue-contusions_SERIOUS_INJURY', 'inj_soft-tissue-contusions', 'SERIOUS_INJURY', 0.3);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_soft-tissue-contusions_FATAL', 'inj_soft-tissue-contusions', 'FATAL', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_knee-ligament-tears_PROPERTY_DAMAGE_ONLY', 'inj_knee-ligament-tears', 'PROPERTY_DAMAGE_ONLY', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_knee-ligament-tears_POSSIBLE_INJURY', 'inj_knee-ligament-tears', 'POSSIBLE_INJURY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_knee-ligament-tears_MINOR_INJURY', 'inj_knee-ligament-tears', 'MINOR_INJURY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_knee-ligament-tears_SERIOUS_INJURY', 'inj_knee-ligament-tears', 'SERIOUS_INJURY', 0.3);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_knee-ligament-tears_FATAL', 'inj_knee-ligament-tears', 'FATAL', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_shoulder-injuries_PROPERTY_DAMAGE_ONLY', 'inj_shoulder-injuries', 'PROPERTY_DAMAGE_ONLY', 0.03);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_shoulder-injuries_POSSIBLE_INJURY', 'inj_shoulder-injuries', 'POSSIBLE_INJURY', 0.1);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_shoulder-injuries_MINOR_INJURY', 'inj_shoulder-injuries', 'MINOR_INJURY', 0.25);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_shoulder-injuries_SERIOUS_INJURY', 'inj_shoulder-injuries', 'SERIOUS_INJURY', 0.35);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_shoulder-injuries_FATAL', 'inj_shoulder-injuries', 'FATAL', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_facial-jaw-fractures_PROPERTY_DAMAGE_ONLY', 'inj_facial-jaw-fractures', 'PROPERTY_DAMAGE_ONLY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_facial-jaw-fractures_POSSIBLE_INJURY', 'inj_facial-jaw-fractures', 'POSSIBLE_INJURY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_facial-jaw-fractures_MINOR_INJURY', 'inj_facial-jaw-fractures', 'MINOR_INJURY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_facial-jaw-fractures_SERIOUS_INJURY', 'inj_facial-jaw-fractures', 'SERIOUS_INJURY', 0.3);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_facial-jaw-fractures_FATAL', 'inj_facial-jaw-fractures', 'FATAL', 0.1);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_burns_PROPERTY_DAMAGE_ONLY', 'inj_burns', 'PROPERTY_DAMAGE_ONLY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_burns_POSSIBLE_INJURY', 'inj_burns', 'POSSIBLE_INJURY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_burns_MINOR_INJURY', 'inj_burns', 'MINOR_INJURY', 0.03);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_burns_SERIOUS_INJURY', 'inj_burns', 'SERIOUS_INJURY', 0.1);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_burns_FATAL', 'inj_burns', 'FATAL', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-inhalation-injury_PROPERTY_DAMAGE_ONLY', 'inj_chemical-inhalation-injury', 'PROPERTY_DAMAGE_ONLY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-inhalation-injury_POSSIBLE_INJURY', 'inj_chemical-inhalation-injury', 'POSSIBLE_INJURY', 0.03);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-inhalation-injury_MINOR_INJURY', 'inj_chemical-inhalation-injury', 'MINOR_INJURY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-inhalation-injury_SERIOUS_INJURY', 'inj_chemical-inhalation-injury', 'SERIOUS_INJURY', 0.1);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-inhalation-injury_FATAL', 'inj_chemical-inhalation-injury', 'FATAL', 0.08);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_asbestos-mesothelioma_FATAL', 'inj_asbestos-mesothelioma', 'FATAL', 0);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-burns_PROPERTY_DAMAGE_ONLY', 'inj_chemical-burns', 'PROPERTY_DAMAGE_ONLY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-burns_POSSIBLE_INJURY', 'inj_chemical-burns', 'POSSIBLE_INJURY', 0.01);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-burns_MINOR_INJURY', 'inj_chemical-burns', 'MINOR_INJURY', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-burns_SERIOUS_INJURY', 'inj_chemical-burns', 'SERIOUS_INJURY', 0.05);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_chemical-burns_FATAL', 'inj_chemical-burns', 'FATAL', 0.02);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_pedestrian-impact-injuries_POSSIBLE_INJURY', 'inj_pedestrian-impact-injuries', 'POSSIBLE_INJURY', 0.1);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_pedestrian-impact-injuries_MINOR_INJURY', 'inj_pedestrian-impact-injuries', 'MINOR_INJURY', 0.3);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_pedestrian-impact-injuries_SERIOUS_INJURY', 'inj_pedestrian-impact-injuries', 'SERIOUS_INJURY', 0.5);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_pedestrian-impact-injuries_FATAL', 'inj_pedestrian-impact-injuries', 'FATAL', 0.4);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_bicycle-crash-injuries_POSSIBLE_INJURY', 'inj_bicycle-crash-injuries', 'POSSIBLE_INJURY', 0.15);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_bicycle-crash-injuries_MINOR_INJURY', 'inj_bicycle-crash-injuries', 'MINOR_INJURY', 0.35);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_bicycle-crash-injuries_SERIOUS_INJURY', 'inj_bicycle-crash-injuries', 'SERIOUS_INJURY', 0.4);
INSERT OR REPLACE INTO injury_crash_severity_map (id, injury_id, crash_severity, likelihood)
  VALUES ('sev_bicycle-crash-injuries_FATAL', 'inj_bicycle-crash-injuries', 'FATAL', 0.25);

-- ============================================================================
-- WISQARS Aggregate Costs
-- ============================================================================
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_0', 'WISQARS', 2021, 'Motor Vehicle Traffic', 'Unintentional', 'Fatal', 28733, 1149320000, 1584811, 63392440000, 0, 1613544, 64541760000, 39508);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_1', 'WISQARS', 2021, 'Motor Vehicle Traffic', 'Unintentional', 'Hospitalized', 57768, 20553696000, 72893, 25939149000, 181356000000, 130661, 46492845000, 355711);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_2', 'WISQARS', 2021, 'Motor Vehicle Traffic', 'Unintentional', 'ED_Treated', 4284, 10917636000, 3751, 9558009000, 47682000000, 8035, 20475645000, 2548263);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_3', 'WISQARS', 2021, 'Fall', 'Unintentional', 'Fatal', 30122, 1279184000, 724611, 30785946000, 0, 754733, 32065130000, 42114);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_4', 'WISQARS', 2021, 'Fall', 'Unintentional', 'Hospitalized', 37891, 36003550000, 22447, 21325665000, 120782000000, 60338, 57329215000, 950304);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_5', 'WISQARS', 2021, 'Fall', 'Unintentional', 'ED_Treated', 2987, 20430690000, 2411, 16490238000, 65844000000, 5398, 36920928000, 6840108);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_6', 'WISQARS', 2021, 'Poisoning', 'Unintentional', 'Fatal', 7645, 625017000, 1667890, 136308910000, 0, 1675535, 136933927000, 81756);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, medical_cost_total, work_loss_cost_avg, work_loss_cost_total, quality_life_cost, combined_cost_avg, combined_cost_total, number_of_cases)
  VALUES ('wisqars_7', 'WISQARS', 2021, 'Poisoning', 'Unintentional', 'Hospitalized', 20165, 3851514000, 18230, 3481933000, 25418000000, 38395, 7333447000, 190990);

-- ============================================================================
-- NHTSA Cost by Severity
-- ============================================================================
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, work_loss_cost_avg, combined_cost_avg, quality_life_cost)
  VALUES ('nhtsa_0', 'NHTSA', 2019, 'Motor Vehicle Traffic', 'Unintentional', 'KABCO_K_Fatal', 28600, 1868000, 1778000, 12118000);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, work_loss_cost_avg, combined_cost_avg, quality_life_cost)
  VALUES ('nhtsa_1', 'NHTSA', 2019, 'Motor Vehicle Traffic', 'Unintentional', 'KABCO_A_Incapacitating', 109300, 132900, 281300, 620800);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, work_loss_cost_avg, combined_cost_avg, quality_life_cost)
  VALUES ('nhtsa_2', 'NHTSA', 2019, 'Motor Vehicle Traffic', 'Unintentional', 'KABCO_B_NonIncapacitating', 33100, 30100, 79900, 143100);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, work_loss_cost_avg, combined_cost_avg, quality_life_cost)
  VALUES ('nhtsa_3', 'NHTSA', 2019, 'Motor Vehicle Traffic', 'Unintentional', 'KABCO_C_Possible', 10500, 13800, 35500, 63800);
INSERT OR REPLACE INTO injury_cost_aggregates (id, source, year, mechanism, intent, outcome, medical_cost_avg, work_loss_cost_avg, combined_cost_avg, quality_life_cost)
  VALUES ('nhtsa_4', 'NHTSA', 2019, 'Motor Vehicle Traffic', 'Unintentional', 'KABCO_O_NoneReported', 800, 3000, 7600, 2100);

-- ============================================================================
-- Geographic Cost Indices (20 metro areas)
-- ============================================================================
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_CO_Denver', 'proc_99283', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 86.73, 147, 1.5, 130.1, 216.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_CO_Denver', 'proc_99284', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 141.73, 222.76, 1.5, 212.59, 354.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_CO_Denver', 'proc_99285', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 191.9, 297.36, 1.5, 287.85, 479.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_CO_Denver', 'proc_99213', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 67.57, 105.07, 1.5, 101.35, 168.93, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_CO_Denver', 'proc_99214', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 98.5, 147.05, 1.5, 147.75, 246.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_CO_Denver', 'proc_97110', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 21, 32.39, 1.5, 31.5, 52.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_CO_Denver', 'proc_97140', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 20.01, 30.39, 1.5, 30.02, 50.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_CO_Denver', 'proc_72141', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 86.92, 322.3, 1.5, 130.38, 217.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_CO_Denver', 'proc_72148', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 86.92, 317.94, 1.5, 130.38, 217.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_CO_Denver', 'proc_70450', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 66.51, 201.11, 1.5, 99.77, 166.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_CO_Denver', 'proc_70551', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 87.92, 317.94, 1.5, 131.88, 219.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_CO_Denver', 'proc_73721', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 81.01, 299.65, 1.5, 121.52, 202.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_CO_Denver', 'proc_74178', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 115.64, 360.06, 1.5, 173.46, 289.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_CO_Denver', 'proc_71260', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 88.17, 272.32, 1.5, 132.26, 220.43, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_CO_Denver', 'proc_27427', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 748.61, NULL, 1.5, 1122.92, 1871.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_CO_Denver', 'proc_22612', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 1307.72, NULL, 1.5, 1961.58, 3269.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_CO_Denver', 'proc_63030', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 737.67, NULL, 1.5, 1106.5, 1844.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_CO_Denver', 'proc_25605', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 243.5, 297.08, 1.5, 365.25, 608.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_CO_Denver', 'proc_99291', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 223.06, 323.5, 1.5, 334.59, 557.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_CO_Denver', 'proc_90837', 'CO', 'Denver', '07', 1.01, 1.03, 0.84, 76.83, 108.64, 1.5, 115.25, 192.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_CO_RestofColorado', 'proc_99283', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 84.29, 140.48, 1.5, 126.44, 210.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_CO_RestofColorado', 'proc_99284', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 138.01, 213.56, 1.5, 207.02, 345.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_CO_RestofColorado', 'proc_99285', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 187.04, 285.38, 1.5, 280.56, 467.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_CO_RestofColorado', 'proc_99213', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 65.65, 100.62, 1.5, 98.48, 164.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_CO_RestofColorado', 'proc_99214', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 95.78, 141.04, 1.5, 143.67, 239.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_CO_RestofColorado', 'proc_97110', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 20.45, 31.06, 1.5, 30.67, 51.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_CO_RestofColorado', 'proc_97140', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 19.49, 29.17, 1.5, 29.24, 48.72, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_CO_RestofColorado', 'proc_72141', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 83.34, 302.8, 1.5, 125.01, 208.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_CO_RestofColorado', 'proc_72148', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 83.34, 298.74, 1.5, 125.01, 208.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_CO_RestofColorado', 'proc_70450', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 63.74, 189.24, 1.5, 95.61, 159.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_CO_RestofColorado', 'proc_70551', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 84.27, 298.74, 1.5, 126.41, 210.68, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_CO_RestofColorado', 'proc_73721', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 77.68, 281.53, 1.5, 116.52, 194.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_CO_RestofColorado', 'proc_74178', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 111.34, 339.23, 1.5, 167.01, 278.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_CO_RestofColorado', 'proc_71260', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 84.71, 256.41, 1.5, 127.07, 211.77, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_CO_RestofColorado', 'proc_27427', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 726.99, NULL, 1.5, 1090.49, 1817.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_CO_RestofColorado', 'proc_22612', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 1272.6, NULL, 1.5, 1908.9, 3181.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_CO_RestofColorado', 'proc_63030', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 716.99, NULL, 1.5, 1075.49, 1792.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_CO_RestofColorado', 'proc_25605', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 237.68, 287.63, 1.5, 356.52, 594.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_CO_RestofColorado', 'proc_99291', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 217.64, 311.29, 1.5, 326.46, 544.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_CO_RestofColorado', 'proc_90837', 'CO', 'Rest of Colorado', '07', 1, 0.97, 0.84, 74.93, 104.59, 1.5, 112.4, 187.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_CA_LosAngeles', 'proc_99283', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 92.6, 162.01, 1.5, 138.9, 231.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_CA_LosAngeles', 'proc_99284', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 150.74, 244.06, 1.5, 226.11, 376.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_CA_LosAngeles', 'proc_99285', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 203.71, 325.18, 1.5, 305.57, 509.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_CA_LosAngeles', 'proc_99213', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 72.2, 115.39, 1.5, 108.3, 180.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_CA_LosAngeles', 'proc_99214', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 105.11, 161.03, 1.5, 157.67, 262.77, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_CA_LosAngeles', 'proc_97110', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 22.37, 35.48, 1.5, 33.56, 55.93, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_CA_LosAngeles', 'proc_97140', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 21.31, 33.26, 1.5, 31.96, 53.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_CA_LosAngeles', 'proc_72141', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 95.24, 366.33, 1.5, 142.86, 238.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_CA_LosAngeles', 'proc_72148', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 95.24, 361.31, 1.5, 142.86, 238.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_CA_LosAngeles', 'proc_70450', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 72.93, 227.95, 1.5, 109.4, 182.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_CA_LosAngeles', 'proc_70551', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 96.4, 361.31, 1.5, 144.6, 241, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_CA_LosAngeles', 'proc_73721', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 88.76, 340.56, 1.5, 133.14, 221.9, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_CA_LosAngeles', 'proc_74178', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 125.73, 407.23, 1.5, 188.6, 314.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_CA_LosAngeles', 'proc_71260', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 96.25, 308.33, 1.5, 144.38, 240.63, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_CA_LosAngeles', 'proc_27427', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 800.29, NULL, 1.5, 1200.44, 2000.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_CA_LosAngeles', 'proc_22612', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 1391.93, NULL, 1.5, 2087.9, 3479.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_CA_LosAngeles', 'proc_63030', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 787.17, NULL, 1.5, 1180.75, 1967.93, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_CA_LosAngeles', 'proc_25605', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 257.81, 319.51, 1.5, 386.72, 644.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_CA_LosAngeles', 'proc_99291', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 236.31, 352, 1.5, 354.47, 590.78, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_CA_LosAngeles', 'proc_90837', 'CA', 'Los Angeles', '01', 1.04, 1.19, 0.84, 81.54, 118.17, 1.5, 122.31, 203.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_CA_SanFrancisco', 'proc_99283', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 100.84, 188.07, 1.5, 151.26, 252.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_CA_SanFrancisco', 'proc_99284', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 162.79, 280.06, 1.5, 244.19, 406.98, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_CA_SanFrancisco', 'proc_99285', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 219.15, 371.8, 1.5, 328.73, 547.88, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_CA_SanFrancisco', 'proc_99213', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 79.08, 133.36, 1.5, 118.62, 197.7, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_CA_SanFrancisco', 'proc_99214', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 114.78, 185.05, 1.5, 172.17, 286.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_CA_SanFrancisco', 'proc_97110', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 24.47, 40.95, 1.5, 36.71, 61.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_CA_SanFrancisco', 'proc_97140', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 23.29, 38.32, 1.5, 34.94, 58.22, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_CA_SanFrancisco', 'proc_72141', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 109.64, 450.32, 1.5, 164.46, 274.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_CA_SanFrancisco', 'proc_72148', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 109.64, 444.02, 1.5, 164.46, 274.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_CA_SanFrancisco', 'proc_70450', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 84.06, 278.87, 1.5, 126.09, 210.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_CA_SanFrancisco', 'proc_70551', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 111.1, 444.02, 1.5, 166.65, 277.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_CA_SanFrancisco', 'proc_73721', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 102.18, 418.63, 1.5, 153.27, 255.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_CA_SanFrancisco', 'proc_74178', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 142.66, 496.42, 1.5, 213.99, 356.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_CA_SanFrancisco', 'proc_71260', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 110.05, 376.58, 1.5, 165.08, 275.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_CA_SanFrancisco', 'proc_27427', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 872.25, NULL, 1.5, 1308.38, 2180.63, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_CA_SanFrancisco', 'proc_22612', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 1498.08, NULL, 1.5, 2247.12, 3745.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_CA_SanFrancisco', 'proc_63030', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 853.58, NULL, 1.5, 1280.37, 2133.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_CA_SanFrancisco', 'proc_25605', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 276.1, 353.63, 1.5, 414.15, 690.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_CA_SanFrancisco', 'proc_99291', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 252.99, 398.37, 1.5, 379.49, 632.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_CA_SanFrancisco', 'proc_90837', 'CA', 'San Francisco', '01', 1.07, 1.5, 0.61, 88.36, 134.4, 1.5, 132.54, 220.9, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_NY_Manhattan', 'proc_99283', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 108.85, 199.75, 1.5, 163.27, 272.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_NY_Manhattan', 'proc_99284', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 176.16, 298.37, 1.5, 264.24, 440.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_NY_Manhattan', 'proc_99285', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 237.27, 396.34, 1.5, 355.91, 593.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_NY_Manhattan', 'proc_99213', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 83.99, 140.55, 1.5, 125.98, 209.98, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_NY_Manhattan', 'proc_99214', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 122.1, 195.32, 1.5, 183.15, 305.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_NY_Manhattan', 'proc_97110', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 25.44, 42.61, 1.5, 38.16, 63.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_NY_Manhattan', 'proc_97140', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 24.23, 39.88, 1.5, 36.35, 60.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_NY_Manhattan', 'proc_72141', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 115.5, 470.51, 1.5, 173.25, 288.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_NY_Manhattan', 'proc_72148', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 115.5, 463.94, 1.5, 173.25, 288.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_NY_Manhattan', 'proc_70450', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 88.59, 291.59, 1.5, 132.89, 221.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_NY_Manhattan', 'proc_70551', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 117.02, 463.94, 1.5, 175.53, 292.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_NY_Manhattan', 'proc_73721', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 107.55, 437.31, 1.5, 161.32, 268.88, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_NY_Manhattan', 'proc_74178', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 150.4, 519.04, 1.5, 225.6, 376, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_NY_Manhattan', 'proc_71260', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 115.86, 393.6, 1.5, 173.79, 289.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_NY_Manhattan', 'proc_27427', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 947.21, NULL, 1.5, 1420.82, 2368.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_NY_Manhattan', 'proc_22612', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 1651.37, NULL, 1.5, 2477.05, 4128.42, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_NY_Manhattan', 'proc_63030', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 932.35, NULL, 1.5, 1398.53, 2330.88, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_NY_Manhattan', 'proc_25605', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 298.01, 378.8, 1.5, 447.02, 745.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_NY_Manhattan', 'proc_99291', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 274.69, 426.19, 1.5, 412.04, 686.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_NY_Manhattan', 'proc_90837', 'NY', 'Manhattan', '13', 1.09, 1.56, 1.31, 92.78, 140.76, 1.5, 139.17, 231.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_NY_RestofNewYork', 'proc_99283', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 86.03, 142.8, 1.5, 129.05, 215.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_NY_RestofNewYork', 'proc_99284', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 140.94, 217.27, 1.5, 211.41, 352.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_NY_RestofNewYork', 'proc_99285', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 191.04, 290.39, 1.5, 286.56, 477.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_NY_RestofNewYork', 'proc_99213', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 66.8, 102.12, 1.5, 100.2, 167, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_NY_RestofNewYork', 'proc_99214', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 97.48, 143.21, 1.5, 146.22, 243.7, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_NY_RestofNewYork', 'proc_97110', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 20.72, 31.44, 1.5, 31.08, 51.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_NY_RestofNewYork', 'proc_97140', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 19.75, 29.53, 1.5, 29.63, 49.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_NY_RestofNewYork', 'proc_72141', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 84.58, 306.32, 1.5, 126.87, 211.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_NY_RestofNewYork', 'proc_72148', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 84.58, 302.22, 1.5, 126.87, 211.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_NY_RestofNewYork', 'proc_70450', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 64.7, 191.49, 1.5, 97.05, 161.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_NY_RestofNewYork', 'proc_70551', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 85.53, 302.22, 1.5, 128.3, 213.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_NY_RestofNewYork', 'proc_73721', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 78.82, 284.79, 1.5, 118.23, 197.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_NY_RestofNewYork', 'proc_74178', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 113.05, 343.3, 1.5, 169.58, 282.63, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_NY_RestofNewYork', 'proc_71260', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 85.97, 259.45, 1.5, 128.95, 214.93, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_NY_RestofNewYork', 'proc_27427', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 742.89, NULL, 1.5, 1114.34, 1857.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_NY_RestofNewYork', 'proc_22612', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 1304.33, NULL, 1.5, 1956.5, 3260.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_NY_RestofNewYork', 'proc_63030', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 733.53, NULL, 1.5, 1100.3, 1833.82, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_NY_RestofNewYork', 'proc_25605', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 242.63, 293.09, 1.5, 363.95, 606.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_NY_RestofNewYork', 'proc_99291', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 222.42, 317.04, 1.5, 333.63, 556.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_NY_RestofNewYork', 'proc_90837', 'NY', 'Rest of New York', '13', 1.01, 0.98, 0.96, 76.08, 106.05, 1.5, 114.12, 190.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_TX_Dallas', 'proc_99283', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 86.5, 145.2, 1.5, 129.75, 216.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_TX_Dallas', 'proc_99284', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 141.52, 220.44, 1.5, 212.28, 353.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_TX_Dallas', 'proc_99285', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 191.71, 294.43, 1.5, 287.57, 479.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_TX_Dallas', 'proc_99213', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 67.27, 103.79, 1.5, 100.91, 168.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_TX_Dallas', 'proc_99214', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 98.11, 145.39, 1.5, 147.17, 245.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_TX_Dallas', 'proc_97110', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 20.88, 31.97, 1.5, 31.32, 52.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_TX_Dallas', 'proc_97140', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 19.9, 30.01, 1.5, 29.85, 49.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_TX_Dallas', 'proc_72141', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 85.9, 315.14, 1.5, 128.85, 214.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_TX_Dallas', 'proc_72148', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 85.9, 310.9, 1.5, 128.85, 214.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_TX_Dallas', 'proc_70450', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 65.72, 196.81, 1.5, 98.58, 164.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_TX_Dallas', 'proc_70551', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 86.88, 310.9, 1.5, 130.32, 217.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_TX_Dallas', 'proc_73721', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 80.06, 292.99, 1.5, 120.09, 200.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_TX_Dallas', 'proc_74178', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 114.53, 352.57, 1.5, 171.8, 286.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_TX_Dallas', 'proc_71260', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 87.22, 266.57, 1.5, 130.83, 218.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_TX_Dallas', 'proc_27427', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 746.88, NULL, 1.5, 1120.32, 1867.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_TX_Dallas', 'proc_22612', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 1308.07, NULL, 1.5, 1962.11, 3270.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_TX_Dallas', 'proc_63030', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 736.72, NULL, 1.5, 1105.08, 1841.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_TX_Dallas', 'proc_25605', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 243.36, 295.53, 1.5, 365.04, 608.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_TX_Dallas', 'proc_99291', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 223.02, 320.85, 1.5, 334.53, 557.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_TX_Dallas', 'proc_90837', 'TX', 'Dallas', '04', 1.01, 1.01, 0.91, 76.53, 107.51, 1.5, 114.8, 191.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_TX_Houston', 'proc_99283', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 87.98, 147.43, 1.5, 131.97, 219.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_TX_Houston', 'proc_99284', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 143.98, 223.91, 1.5, 215.97, 359.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_TX_Houston', 'proc_99285', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 195.03, 299.07, 1.5, 292.55, 487.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_TX_Houston', 'proc_99213', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 68.17, 105.16, 1.5, 102.26, 170.43, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_TX_Houston', 'proc_99214', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 99.45, 147.35, 1.5, 149.18, 248.63, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_TX_Houston', 'proc_97110', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 21.06, 32.29, 1.5, 31.59, 52.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_TX_Houston', 'proc_97140', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 20.07, 30.31, 1.5, 30.11, 50.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_TX_Houston', 'proc_72141', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 87.02, 319.22, 1.5, 130.53, 217.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_TX_Houston', 'proc_72148', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 87.02, 314.92, 1.5, 130.53, 217.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_TX_Houston', 'proc_70450', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 66.59, 199.36, 1.5, 99.89, 166.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_TX_Houston', 'proc_70551', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 88.01, 314.92, 1.5, 132.02, 220.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_TX_Houston', 'proc_73721', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 81.08, 296.76, 1.5, 121.62, 202.7, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_TX_Houston', 'proc_74178', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 115.98, 357.1, 1.5, 173.97, 289.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_TX_Houston', 'proc_71260', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 88.32, 269.98, 1.5, 132.48, 220.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_TX_Houston', 'proc_27427', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 760.71, NULL, 1.5, 1141.07, 1901.78, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_TX_Houston', 'proc_22612', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 1336.31, NULL, 1.5, 2004.47, 3340.77, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_TX_Houston', 'proc_63030', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 751.25, NULL, 1.5, 1126.88, 1878.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_TX_Houston', 'proc_25605', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 247.35, 300.2, 1.5, 371.03, 618.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_TX_Houston', 'proc_99291', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 226.99, 326.08, 1.5, 340.49, 567.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_TX_Houston', 'proc_90837', 'TX', 'Houston', '04', 1.01, 1.02, 1.03, 77.33, 108.71, 1.5, 116, 193.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_TX_RestofTexas', 'proc_99283', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 82.63, 134.34, 1.5, 123.95, 206.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_TX_RestofTexas', 'proc_99284', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 135.7, 205.22, 1.5, 203.55, 339.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_TX_RestofTexas', 'proc_99285', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 184.15, 274.64, 1.5, 276.23, 460.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_TX_RestofTexas', 'proc_99213', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 64.24, 96.42, 1.5, 96.36, 160.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_TX_RestofTexas', 'proc_99214', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 93.82, 135.47, 1.5, 140.73, 234.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_TX_RestofTexas', 'proc_97110', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 20.02, 29.79, 1.5, 30.03, 50.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_TX_RestofTexas', 'proc_97140', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 19.09, 27.99, 1.5, 28.64, 47.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_TX_RestofTexas', 'proc_72141', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 79.99, 281.94, 1.5, 119.98, 199.98, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_TX_RestofTexas', 'proc_72148', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 79.99, 278.2, 1.5, 119.98, 199.98, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_TX_RestofTexas', 'proc_70450', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 61.15, 176.63, 1.5, 91.73, 152.88, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_TX_RestofTexas', 'proc_70551', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 80.85, 278.2, 1.5, 121.28, 202.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_TX_RestofTexas', 'proc_73721', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 74.56, 262.14, 1.5, 111.84, 186.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_TX_RestofTexas', 'proc_74178', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 107.5, 317.21, 1.5, 161.25, 268.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_TX_RestofTexas', 'proc_71260', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 81.54, 239.53, 1.5, 122.31, 203.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_TX_RestofTexas', 'proc_27427', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 712.45, NULL, 1.5, 1068.68, 1781.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_TX_RestofTexas', 'proc_22612', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 1252.53, NULL, 1.5, 1878.8, 3131.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_TX_RestofTexas', 'proc_63030', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 703.89, NULL, 1.5, 1055.84, 1759.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_TX_RestofTexas', 'proc_25605', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 234.38, 280.34, 1.5, 351.57, 585.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_TX_RestofTexas', 'proc_99291', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 214.63, 300.81, 1.5, 321.95, 536.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_TX_RestofTexas', 'proc_90837', 'TX', 'Rest of Texas', '04', 1, 0.89, 0.91, 73.61, 100.9, 1.5, 110.42, 184.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_FL_Miami', 'proc_99283', 'FL', 'Miami', '09', 1, 1.07, 1.49, 91.81, 154.24, 1.5, 137.72, 229.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_FL_Miami', 'proc_99284', 'FL', 'Miami', '09', 1, 1.07, 1.49, 150.26, 234.18, 1.5, 225.39, 375.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_FL_Miami', 'proc_99285', 'FL', 'Miami', '09', 1, 1.07, 1.49, 203.41, 312.65, 1.5, 305.12, 508.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_FL_Miami', 'proc_99213', 'FL', 'Miami', '09', 1, 1.07, 1.49, 70.23, 109.07, 1.5, 105.35, 175.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_FL_Miami', 'proc_99214', 'FL', 'Miami', '09', 1, 1.07, 1.49, 102.54, 152.82, 1.5, 153.81, 256.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_FL_Miami', 'proc_97110', 'FL', 'Miami', '09', 1, 1.07, 1.49, 21.28, 33.07, 1.5, 31.92, 53.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_FL_Miami', 'proc_97140', 'FL', 'Miami', '09', 1, 1.07, 1.49, 20.29, 31.04, 1.5, 30.44, 50.72, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_FL_Miami', 'proc_72141', 'FL', 'Miami', '09', 1, 1.07, 1.49, 90.13, 333.92, 1.5, 135.2, 225.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_FL_Miami', 'proc_72148', 'FL', 'Miami', '09', 1, 1.07, 1.49, 90.13, 329.41, 1.5, 135.2, 225.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_FL_Miami', 'proc_70450', 'FL', 'Miami', '09', 1, 1.07, 1.49, 69.01, 208.42, 1.5, 103.52, 172.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_FL_Miami', 'proc_70551', 'FL', 'Miami', '09', 1, 1.07, 1.49, 91.17, 329.41, 1.5, 136.76, 227.93, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_FL_Miami', 'proc_73721', 'FL', 'Miami', '09', 1, 1.07, 1.49, 83.91, 310.37, 1.5, 125.87, 209.77, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_FL_Miami', 'proc_74178', 'FL', 'Miami', '09', 1, 1.07, 1.49, 119.76, 372.92, 1.5, 179.64, 299.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_FL_Miami', 'proc_71260', 'FL', 'Miami', '09', 1, 1.07, 1.49, 91.26, 281.99, 1.5, 136.89, 228.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_FL_Miami', 'proc_27427', 'FL', 'Miami', '09', 1, 1.07, 1.49, 798.26, NULL, 1.5, 1197.39, 1995.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_FL_Miami', 'proc_22612', 'FL', 'Miami', '09', 1, 1.07, 1.49, 1415.7, NULL, 1.5, 2123.55, 3539.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_FL_Miami', 'proc_63030', 'FL', 'Miami', '09', 1, 1.07, 1.49, 791.25, NULL, 1.5, 1186.88, 1978.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_FL_Miami', 'proc_25605', 'FL', 'Miami', '09', 1, 1.07, 1.49, 257.01, 312.49, 1.5, 385.52, 642.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_FL_Miami', 'proc_99291', 'FL', 'Miami', '09', 1, 1.07, 1.49, 237.03, 341.07, 1.5, 355.55, 592.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_FL_Miami', 'proc_90837', 'FL', 'Miami', '09', 1, 1.07, 1.49, 78.68, 111.62, 1.5, 118.02, 196.7, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_FL_RestofFlorida', 'proc_99283', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 84.37, 140.27, 1.5, 126.56, 210.93, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_FL_RestofFlorida', 'proc_99284', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 138.19, 213.35, 1.5, 207.29, 345.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_FL_RestofFlorida', 'proc_99285', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 187.31, 285.13, 1.5, 280.97, 468.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_FL_RestofFlorida', 'proc_99213', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 65.66, 100.44, 1.5, 98.49, 164.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_FL_RestofFlorida', 'proc_99214', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 95.8, 140.83, 1.5, 143.7, 239.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_FL_RestofFlorida', 'proc_97110', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 20.43, 30.99, 1.5, 30.65, 51.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_FL_RestofFlorida', 'proc_97140', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 19.47, 29.1, 1.5, 29.21, 48.68, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_FL_RestofFlorida', 'proc_72141', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 83.2, 301.52, 1.5, 124.8, 208, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_FL_RestofFlorida', 'proc_72148', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 83.2, 297.48, 1.5, 124.8, 208, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_FL_RestofFlorida', 'proc_70450', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 63.64, 188.48, 1.5, 95.46, 159.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_FL_RestofFlorida', 'proc_70551', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 84.13, 297.48, 1.5, 126.2, 210.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_FL_RestofFlorida', 'proc_73721', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 77.54, 280.34, 1.5, 116.31, 193.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_FL_RestofFlorida', 'proc_74178', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 111.2, 337.91, 1.5, 166.8, 278, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_FL_RestofFlorida', 'proc_71260', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 84.58, 255.39, 1.5, 126.87, 211.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_FL_RestofFlorida', 'proc_27427', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 727.91, NULL, 1.5, 1091.87, 1819.78, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_FL_RestofFlorida', 'proc_22612', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 1275.5, NULL, 1.5, 1913.25, 3188.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_FL_RestofFlorida', 'proc_63030', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 718.18, NULL, 1.5, 1077.27, 1795.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_FL_RestofFlorida', 'proc_25605', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 238.01, 287.7, 1.5, 357.02, 595.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_FL_RestofFlorida', 'proc_99291', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 218, 311.17, 1.5, 327, 545, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_FL_RestofFlorida', 'proc_90837', 'FL', 'Rest of Florida', '09', 1, 0.96, 0.87, 74.92, 104.42, 1.5, 112.38, 187.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_IL_Chicago', 'proc_99283', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 91.02, 152.46, 1.5, 136.53, 227.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_IL_Chicago', 'proc_99284', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 149, 231.59, 1.5, 223.5, 372.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_IL_Chicago', 'proc_99285', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 201.79, 309.29, 1.5, 302.69, 504.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_IL_Chicago', 'proc_99213', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 70.05, 108.27, 1.5, 105.07, 175.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_IL_Chicago', 'proc_99214', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 102.24, 151.73, 1.5, 153.36, 255.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_IL_Chicago', 'proc_97110', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 21.42, 33.03, 1.5, 32.13, 53.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_IL_Chicago', 'proc_97140', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 20.42, 31, 1.5, 30.63, 51.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_IL_Chicago', 'proc_72141', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 89.54, 329.47, 1.5, 134.31, 223.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_IL_Chicago', 'proc_72148', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 89.54, 325.03, 1.5, 134.31, 223.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_IL_Chicago', 'proc_70450', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 68.53, 205.73, 1.5, 102.8, 171.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_IL_Chicago', 'proc_70551', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 90.56, 325.03, 1.5, 135.84, 226.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_IL_Chicago', 'proc_73721', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 83.4, 306.26, 1.5, 125.1, 208.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_IL_Chicago', 'proc_74178', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 119.2, 368.34, 1.5, 178.8, 298, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_IL_Chicago', 'proc_71260', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 90.78, 278.49, 1.5, 136.17, 226.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_IL_Chicago', 'proc_27427', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 789.3, NULL, 1.5, 1183.95, 1973.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_IL_Chicago', 'proc_22612', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 1393.93, NULL, 1.5, 2090.9, 3484.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_IL_Chicago', 'proc_63030', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 781.1, NULL, 1.5, 1171.65, 1952.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_IL_Chicago', 'proc_25605', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 255.44, 310.05, 1.5, 383.16, 638.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_IL_Chicago', 'proc_99291', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 235.03, 337.41, 1.5, 352.55, 587.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_IL_Chicago', 'proc_90837', 'IL', 'Chicago', '06', 1.02, 1.06, 1.29, 78.97, 111.39, 1.5, 118.46, 197.43, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_PA_Philadelphia', 'proc_99283', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 89.37, 152.85, 1.5, 134.06, 223.43, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_PA_Philadelphia', 'proc_99284', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 145.9, 231.23, 1.5, 218.85, 364.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_PA_Philadelphia', 'proc_99285', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 197.43, 308.5, 1.5, 296.15, 493.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_PA_Philadelphia', 'proc_99213', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 69.55, 109.05, 1.5, 104.32, 173.88, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_PA_Philadelphia', 'proc_99214', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 101.36, 152.49, 1.5, 152.04, 253.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_PA_Philadelphia', 'proc_97110', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 21.56, 33.55, 1.5, 32.34, 53.9, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_PA_Philadelphia', 'proc_97140', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 20.54, 31.47, 1.5, 30.81, 51.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_PA_Philadelphia', 'proc_72141', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 90.14, 338.03, 1.5, 135.21, 225.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_PA_Philadelphia', 'proc_72148', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 90.14, 333.44, 1.5, 135.21, 225.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_PA_Philadelphia', 'proc_70450', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 68.99, 210.74, 1.5, 103.48, 172.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_PA_Philadelphia', 'proc_70551', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 91.2, 333.44, 1.5, 136.8, 228, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_PA_Philadelphia', 'proc_73721', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 84, 314.26, 1.5, 126, 210, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_PA_Philadelphia', 'proc_74178', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 119.63, 377.04, 1.5, 179.45, 299.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_PA_Philadelphia', 'proc_71260', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 91.32, 285.26, 1.5, 136.98, 228.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_PA_Philadelphia', 'proc_27427', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 772.14, NULL, 1.5, 1158.21, 1930.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_PA_Philadelphia', 'proc_22612', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 1348.61, NULL, 1.5, 2022.92, 3371.52, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_PA_Philadelphia', 'proc_63030', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 760.78, NULL, 1.5, 1141.17, 1901.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_PA_Philadelphia', 'proc_25605', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 250.24, 306.66, 1.5, 375.36, 625.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_PA_Philadelphia', 'proc_99291', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 229.39, 335.17, 1.5, 344.09, 573.47, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_PA_Philadelphia', 'proc_90837', 'PA', 'Philadelphia', '12', 1.02, 1.09, 0.89, 78.84, 112.34, 1.5, 118.26, 197.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_AZ_Phoenix', 'proc_99283', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 85.6, 143.31, 1.5, 128.4, 214, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_AZ_Phoenix', 'proc_99284', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 140.1, 217.68, 1.5, 210.15, 350.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_AZ_Phoenix', 'proc_99285', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 189.8, 290.79, 1.5, 284.7, 474.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_AZ_Phoenix', 'proc_99213', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 66.51, 102.41, 1.5, 99.77, 166.28, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_AZ_Phoenix', 'proc_99214', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 97.02, 143.5, 1.5, 145.53, 242.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_AZ_Phoenix', 'proc_97110', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 20.63, 31.53, 1.5, 30.95, 51.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_AZ_Phoenix', 'proc_97140', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 19.66, 29.6, 1.5, 29.49, 49.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_AZ_Phoenix', 'proc_72141', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 84.78, 310.15, 1.5, 127.17, 211.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_AZ_Phoenix', 'proc_72148', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 84.78, 305.98, 1.5, 127.17, 211.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_AZ_Phoenix', 'proc_70450', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 64.86, 193.74, 1.5, 97.29, 162.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_AZ_Phoenix', 'proc_70551', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 85.74, 305.98, 1.5, 128.61, 214.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_AZ_Phoenix', 'proc_73721', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 79.01, 288.35, 1.5, 118.52, 197.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_AZ_Phoenix', 'proc_74178', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 113.08, 347.11, 1.5, 169.62, 282.7, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_AZ_Phoenix', 'proc_71260', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 86.09, 262.41, 1.5, 129.14, 215.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_AZ_Phoenix', 'proc_27427', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 739.26, NULL, 1.5, 1108.89, 1848.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_AZ_Phoenix', 'proc_22612', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 1296, NULL, 1.5, 1944, 3240, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_AZ_Phoenix', 'proc_63030', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 729.5, NULL, 1.5, 1094.25, 1823.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_AZ_Phoenix', 'proc_25605', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 240.93, 292.22, 1.5, 361.4, 602.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_AZ_Phoenix', 'proc_99291', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 220.85, 317.03, 1.5, 331.28, 552.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_AZ_Phoenix', 'proc_90837', 'AZ', 'Phoenix', '03', 1, 0.99, 0.93, 75.66, 106.11, 1.5, 113.49, 189.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_WA_Seattle', 'proc_99283', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 89.1, 154.03, 1.5, 133.65, 222.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_WA_Seattle', 'proc_99284', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 145.25, 232.54, 1.5, 217.88, 363.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_WA_Seattle', 'proc_99285', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 196.45, 310.07, 1.5, 294.67, 491.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_WA_Seattle', 'proc_99213', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 69.61, 110.01, 1.5, 104.42, 174.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_WA_Seattle', 'proc_99214', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 101.37, 153.68, 1.5, 152.06, 253.43, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_WA_Seattle', 'proc_97110', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 21.66, 33.92, 1.5, 32.49, 54.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_WA_Seattle', 'proc_97140', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 20.64, 31.82, 1.5, 30.96, 51.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_WA_Seattle', 'proc_72141', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 90.89, 344.47, 1.5, 136.34, 227.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_WA_Seattle', 'proc_72148', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 90.89, 339.78, 1.5, 136.34, 227.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_WA_Seattle', 'proc_70450', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 69.58, 214.58, 1.5, 104.37, 173.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_WA_Seattle', 'proc_70551', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 91.98, 339.78, 1.5, 137.97, 229.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_WA_Seattle', 'proc_73721', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 84.72, 320.26, 1.5, 127.08, 211.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_WA_Seattle', 'proc_74178', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 120.4, 383.71, 1.5, 180.6, 301, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_WA_Seattle', 'proc_71260', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 92.02, 290.4, 1.5, 138.03, 230.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_WA_Seattle', 'proc_27427', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 768.94, NULL, 1.5, 1153.41, 1922.35, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_WA_Seattle', 'proc_22612', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 1337.25, NULL, 1.5, 2005.88, 3343.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_WA_Seattle', 'proc_63030', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 756.34, NULL, 1.5, 1134.51, 1890.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_WA_Seattle', 'proc_25605', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 249.03, 306.75, 1.5, 373.55, 622.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_WA_Seattle', 'proc_99291', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 228.01, 336.22, 1.5, 342.02, 570.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_WA_Seattle', 'proc_90837', 'WA', 'Seattle', '02', 1.02, 1.12, 0.76, 78.98, 113.24, 1.5, 118.47, 197.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_NV_LasVegas', 'proc_99283', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 86.53, 146.39, 1.5, 129.8, 216.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_NV_LasVegas', 'proc_99284', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 141.44, 221.92, 1.5, 212.16, 353.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_NV_LasVegas', 'proc_99285', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 191.52, 296.27, 1.5, 287.28, 478.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_NV_LasVegas', 'proc_99213', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 67.37, 104.62, 1.5, 101.06, 168.43, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_NV_LasVegas', 'proc_99214', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 98.22, 146.44, 1.5, 147.33, 245.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_NV_LasVegas', 'proc_97110', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 20.92, 32.23, 1.5, 31.38, 52.3, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_NV_LasVegas', 'proc_97140', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 19.94, 30.25, 1.5, 29.91, 49.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_NV_LasVegas', 'proc_72141', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 86.55, 320.34, 1.5, 129.82, 216.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_NV_LasVegas', 'proc_72148', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 86.55, 316.01, 1.5, 129.82, 216.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_NV_LasVegas', 'proc_70450', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 66.23, 199.91, 1.5, 99.35, 165.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_NV_LasVegas', 'proc_70551', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 87.54, 316.01, 1.5, 131.31, 218.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_NV_LasVegas', 'proc_73721', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 80.66, 297.82, 1.5, 120.99, 201.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_NV_LasVegas', 'proc_74178', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 115.18, 357.95, 1.5, 172.77, 287.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_NV_LasVegas', 'proc_71260', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 87.8, 270.71, 1.5, 131.7, 219.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_NV_LasVegas', 'proc_27427', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 747.05, NULL, 1.5, 1120.57, 1867.63, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_NV_LasVegas', 'proc_22612', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 1305.98, NULL, 1.5, 1958.97, 3264.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_NV_LasVegas', 'proc_63030', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 736.35, NULL, 1.5, 1104.53, 1840.88, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_NV_LasVegas', 'proc_25605', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 243.02, 296.23, 1.5, 364.53, 607.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_NV_LasVegas', 'proc_99291', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 222.66, 322.43, 1.5, 333.99, 556.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_NV_LasVegas', 'proc_90837', 'NV', 'Las Vegas', '01', 1.01, 1.03, 0.86, 76.59, 108.18, 1.5, 114.89, 191.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_GA_Atlanta', 'proc_99283', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 86.96, 146.06, 1.5, 130.44, 217.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_GA_Atlanta', 'proc_99284', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 142.27, 221.73, 1.5, 213.41, 355.68, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_GA_Atlanta', 'proc_99285', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 192.7, 296.13, 1.5, 289.05, 481.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_GA_Atlanta', 'proc_99213', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 67.5, 104.28, 1.5, 101.25, 168.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_GA_Atlanta', 'proc_99214', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 98.46, 146.07, 1.5, 147.69, 246.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_GA_Atlanta', 'proc_97110', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 20.9, 32.06, 1.5, 31.35, 52.25, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_GA_Atlanta', 'proc_97140', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 19.92, 30.1, 1.5, 29.88, 49.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_GA_Atlanta', 'proc_72141', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 86.29, 317.12, 1.5, 129.44, 215.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_GA_Atlanta', 'proc_72148', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 86.29, 312.85, 1.5, 129.44, 215.73, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_GA_Atlanta', 'proc_70450', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 66.02, 198.02, 1.5, 99.03, 165.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_GA_Atlanta', 'proc_70551', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 87.27, 312.85, 1.5, 130.91, 218.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_GA_Atlanta', 'proc_73721', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 80.41, 294.82, 1.5, 120.62, 201.02, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_GA_Atlanta', 'proc_74178', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 114.98, 354.68, 1.5, 172.47, 287.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_GA_Atlanta', 'proc_71260', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 87.58, 268.17, 1.5, 131.37, 218.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_GA_Atlanta', 'proc_27427', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 751.42, NULL, 1.5, 1127.13, 1878.55, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_GA_Atlanta', 'proc_22612', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 1317.8, NULL, 1.5, 1976.7, 3294.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_GA_Atlanta', 'proc_63030', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 741.59, NULL, 1.5, 1112.39, 1853.98, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_GA_Atlanta', 'proc_25605', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 244.47, 297.01, 1.5, 366.71, 611.17, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_GA_Atlanta', 'proc_99291', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 224.2, 322.71, 1.5, 336.3, 560.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_GA_Atlanta', 'proc_90837', 'GA', 'Atlanta', '10', 1.01, 1.01, 0.97, 76.66, 107.85, 1.5, 114.99, 191.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_OH_Cleveland', 'proc_99283', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 87.36, 144.31, 1.5, 131.04, 218.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_OH_Cleveland', 'proc_99284', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 143.22, 219.79, 1.5, 214.83, 358.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_OH_Cleveland', 'proc_99285', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 194.15, 293.81, 1.5, 291.23, 485.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_OH_Cleveland', 'proc_99213', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 67.53, 102.97, 1.5, 101.3, 168.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_OH_Cleveland', 'proc_99214', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 98.6, 144.47, 1.5, 147.9, 246.5, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_OH_Cleveland', 'proc_97110', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 20.83, 31.59, 1.5, 31.24, 52.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_OH_Cleveland', 'proc_97140', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 19.86, 29.67, 1.5, 29.79, 49.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_OH_Cleveland', 'proc_72141', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 85.28, 307.69, 1.5, 127.92, 213.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_OH_Cleveland', 'proc_72148', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 85.28, 303.58, 1.5, 127.92, 213.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_OH_Cleveland', 'proc_70450', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 65.24, 192.42, 1.5, 97.86, 163.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_OH_Cleveland', 'proc_70551', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 86.23, 303.58, 1.5, 129.35, 215.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_OH_Cleveland', 'proc_73721', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 79.45, 286.05, 1.5, 119.18, 198.63, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_OH_Cleveland', 'proc_74178', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 114.03, 344.99, 1.5, 171.05, 285.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_OH_Cleveland', 'proc_71260', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 86.67, 260.68, 1.5, 130.01, 216.68, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_OH_Cleveland', 'proc_27427', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 755.64, NULL, 1.5, 1133.46, 1889.1, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_OH_Cleveland', 'proc_22612', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 1331.96, NULL, 1.5, 1997.94, 3329.9, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_OH_Cleveland', 'proc_63030', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 747.27, NULL, 1.5, 1120.91, 1868.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_OH_Cleveland', 'proc_25605', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 246.38, 297.01, 1.5, 369.57, 615.95, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_OH_Cleveland', 'proc_99291', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 226.21, 321.13, 1.5, 339.32, 565.53, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_OH_Cleveland', 'proc_90837', 'OH', 'Cleveland', '15', 1.01, 0.98, 1.12, 76.7, 106.76, 1.5, 115.05, 191.75, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_MI_Detroit', 'proc_99283', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 92.63, 150.51, 1.5, 138.95, 231.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_MI_Detroit', 'proc_99284', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 152.19, 230.01, 1.5, 228.29, 380.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_MI_Detroit', 'proc_99285', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 206.41, 307.7, 1.5, 309.62, 516.03, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_MI_Detroit', 'proc_99213', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 70.74, 106.76, 1.5, 106.11, 176.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_MI_Detroit', 'proc_99214', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 103.43, 150.06, 1.5, 155.15, 258.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_MI_Detroit', 'proc_97110', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 21.49, 32.42, 1.5, 32.24, 53.72, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_MI_Detroit', 'proc_97140', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 20.49, 30.46, 1.5, 30.74, 51.22, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_MI_Detroit', 'proc_72141', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 88.42, 314.47, 1.5, 132.63, 221.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_MI_Detroit', 'proc_72148', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 88.42, 310.29, 1.5, 132.63, 221.05, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_MI_Detroit', 'proc_70450', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 67.65, 196.92, 1.5, 101.48, 169.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_MI_Detroit', 'proc_70551', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 89.38, 310.29, 1.5, 134.07, 223.45, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_MI_Detroit', 'proc_73721', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 82.33, 292.3, 1.5, 123.5, 205.83, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_MI_Detroit', 'proc_74178', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 118.45, 353.19, 1.5, 177.68, 296.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_MI_Detroit', 'proc_71260', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 89.88, 266.74, 1.5, 134.82, 224.7, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_MI_Detroit', 'proc_27427', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 804.66, NULL, 1.5, 1206.99, 2011.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_MI_Detroit', 'proc_22612', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 1434.09, NULL, 1.5, 2151.13, 3585.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_MI_Detroit', 'proc_63030', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 799.23, NULL, 1.5, 1198.85, 1998.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_MI_Detroit', 'proc_25605', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 261.43, 312.88, 1.5, 392.15, 653.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_MI_Detroit', 'proc_99291', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 241.03, 337.49, 1.5, 361.55, 602.58, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_MI_Detroit', 'proc_90837', 'MI', 'Detroit', '08', 1.04, 0.99, 1.59, 79.76, 110.3, 1.5, 119.64, 199.4, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99283_MA_Boston', 'proc_99283', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 91.65, 161.41, 1.5, 137.48, 229.13, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99284_MA_Boston', 'proc_99284', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 149.06, 242.85, 1.5, 223.59, 372.65, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99285_MA_Boston', 'proc_99285', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 201.39, 323.47, 1.5, 302.08, 503.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99213_MA_Boston', 'proc_99213', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 71.69, 115.1, 1.5, 107.54, 179.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99214_MA_Boston', 'proc_99214', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 104.32, 160.52, 1.5, 156.48, 260.8, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97110_MA_Boston', 'proc_97110', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 22.29, 35.47, 1.5, 33.44, 55.72, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_97140_MA_Boston', 'proc_97140', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 21.23, 33.25, 1.5, 31.85, 53.08, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72141_MA_Boston', 'proc_72141', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 94.99, 367.44, 1.5, 142.48, 237.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_72148_MA_Boston', 'proc_72148', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 94.99, 362.4, 1.5, 142.48, 237.48, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70450_MA_Boston', 'proc_70450', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 72.74, 228.53, 1.5, 109.11, 181.85, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_70551_MA_Boston', 'proc_70551', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 96.15, 362.4, 1.5, 144.23, 240.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_73721_MA_Boston', 'proc_73721', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 88.53, 341.61, 1.5, 132.8, 221.33, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_74178_MA_Boston', 'proc_74178', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 125.27, 408.18, 1.5, 187.91, 313.18, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_71260_MA_Boston', 'proc_71260', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 95.96, 309.11, 1.5, 143.94, 239.9, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_27427_MA_Boston', 'proc_27427', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 791.28, NULL, 1.5, 1186.92, 1978.2, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_22612_MA_Boston', 'proc_22612', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 1371.66, NULL, 1.5, 2057.49, 3429.15, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_63030_MA_Boston', 'proc_63030', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 777.29, NULL, 1.5, 1165.94, 1943.23, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_25605_MA_Boston', 'proc_25605', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 254.95, 316.96, 1.5, 382.42, 637.38, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_99291_MA_Boston', 'proc_99291', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 233.44, 349.71, 1.5, 350.16, 583.6, 2026);
INSERT OR REPLACE INTO medical_cost_geographic (id, procedure_id, state_code, locality, mac_number, work_gpci, pe_gpci, malpractice_gpci, facility_rate, non_facility_rate, commercial_multiplier, estimated_commercial_low, estimated_commercial_high, effective_year)
  VALUES ('geo_90837_MA_Boston', 'proc_90837', 'MA', 'Boston', '14', 1.04, 1.2, 0.72, 81.07, 117.89, 1.5, 121.6, 202.68, 2026);
