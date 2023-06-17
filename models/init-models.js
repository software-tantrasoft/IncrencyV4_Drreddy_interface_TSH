var DataTypes = require("sequelize").DataTypes;
var _tbl_activity_log = require("../models/Activity Log/tbl_activity_log");
var _tbl_alert_param_duration = require("../models/Setting/System Setting/Alert/tbl_alert_param_duration");
var _tbl_alert_weighing_detail = require("../models/Setting/System Setting/Alert/tbl_alert_weighing_detail");
var _tbl_alert_weighing_master = require("../models/Setting/System Setting/Alert/tbl_alert_weighing_master");
var _tbl_archive_log = require("../models/Archive Log/tbl_archive_log");
var _tbl_area_cubicletype = require("../models/Setting/System Setting/tbl_area_cubicletype");
var _tbl_assignedrolewithright = require("../models/Report/Role Log/tbl_assignedrolewithright");
var _tbl_audit_admin_password = require("../models/Home/Change Profile/tbl_audit_admin_password");
var _tbl_audit_adminname = require("../models/Home/Change Profile/tbl_audit_adminname");
var _tbl_audit_alertsetting = require("../models/Setting/System Setting/Alert/tbl_audit_alertsetting");
var _tbl_audit_all_periods = require("../models/Policy/Set All Parameter/tbl_audit_all_periods");
var _tbl_audit_areasetting = require("../models/Setting/System Setting/tbl_audit_areasetting");
var _tbl_audit_bal_setting = require("../models/Master/Instrument/Balance/tbl_audit_bal_setting");
var _tbl_audit_calibration = require("../models/Calibration/tbl_audit_calibration");
var _tbl_audit_calibrationbox = require("../models/Master/Calibration Standard/tbl_audit_calibrationbox");
var _tbl_audit_change_password = require("../models/Home/Change Password/tbl_audit_change_password");
var _tbl_audit_cubicle = require("../models/Setting/System Setting/tbl_audit_cubicle");
var _tbl_audit_department = require("../models/Master/Department/tbl_audit_department");
var _tbl_audit_dtmedia = require("../models/Master/Media/tbl_audit_dtmedia");
var _tbl_audit_machine = require("../models/Master/Machine/tbl_audit_machine");
var _tbl_audit_other_equipment = require("../models/Master/Instrument/Other/tbl_audit_other_equipment");
var _tbl_audit_portsetting = require("../models/Setting/System Setting/tbl_audit_portsetting");
var _tbl_audit_precalibration = require("../models/Calibration/Weight Assignment/tbl_audit_precalibration");
var _tbl_audit_product = require("../models/Master/Product/Tablet/tbl_audit_product");
var _tbl_audit_product_capsule = require("../models/Master/Product/Capsule/tbl_audit_product_capsule");
var _tbl_audit_pwd_complexity = require("../models/Policy/Password Policy/tbl_audit_pwd_complexity");
var _tbl_audit_recalibration = require("../models/Calibration/Recalibration/tbl_audit_recalibration");
var _tbl_audit_role = require("../models/Master/Role/tbl_audit_role");
var _tbl_audit_stages = require("../models/Master/Stage/tbl_audit_stages");
var _tbl_audit_unauthorized_user = require("../models/Home/Unauthorized User/tbl_audit_unauthorized_user");
var _tbl_audit_user_chgpwdown = require("../models/Master/User/tbl_audit_user_chgpwdown");
var _tbl_audit_userpwd = require("../models/Master/User/tbl_audit_userpwd");
var _tbl_audit_users = require("../models/Master/User/tbl_audit_users");
var _tbl_audit_vernier = require("../models/Master/Instrument/Vernier/tbl_audit_vernier");
var _tbl_balance = require("../models/Master/Instrument/Balance/tbl_balance");
var _tbl_balance_weights = require("../models/Master/Instrument/Balance/tbl_balance_weights");
var _tbl_batches = require("../models/Setting/System Setting/tbl_batches");
var _tbl_batchsummary = require("../models/Report/Batch Summary/tbl_batchsummary");
var _tbl_batchsummary_detail1 = require("../models/Report/Batch Summary/tbl_batchsummary_detail1");
var _tbl_batchsummary_detail_hdlb = require("../models/Report/Batch Summary/tbl_batchsummary_detail_hdlb");
var _tbl_batchsummary_detail_hdlb_temp = require("../models/Report/Batch Summary/tbl_batchsummary_detail_hdlb_temp");
var _tbl_batchsummary_detail_temp = require("../models/Report/Batch Summary/tbl_batchsummary_detail_temp");
var _tbl_batchsummary_master1 = require("../models/Report/Batch Summary/tbl_batchsummary_master1");
var _tbl_batchsummary_master_hdlb = require("../models/Report/Batch Summary/tbl_batchsummary_master_hdlb");
var _tbl_batchsummary_master_hdlb_temp = require("../models/Report/Batch Summary/tbl_batchsummary_master_hdlb_temp");
var _tbl_batchsummary_master_temp = require("../models/Report/Batch Summary/tbl_batchsummary_master_temp");
var _tbl_batchsummary_printrecord = require("../models/Report/Batch Summary/tbl_batchsummary_printrecord");
var _tbl_calibration_daily_detail = require("../models/Report/Calibration/Balance/Daily/tbl_calibration_daily_detail");
var _tbl_calibration_daily_detail_incomplete = require("../models/Report/Calibration/Balance/Daily/tbl_calibration_daily_detail_incomplete");
var _tbl_calibration_daily_master = require("../models/Report/Calibration/Balance/Daily/tbl_calibration_daily_master");
var _tbl_calibration_daily_master_incomplete = require("../models/Report/Calibration/Balance/Daily/tbl_calibration_daily_master_incomplete");
var _tbl_calibration_daily_noremark = require("../models/Report/Calibration/Balance/Daily/tbl_calibration_daily_noremark");
var _tbl_calibration_daily_print = require("../models/Report/Calibration/Balance/Daily/tbl_calibration_daily_print");
var _tbl_calibration_eccentricity_detail = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_detail");
var _tbl_calibration_eccentricity_detail_failed = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_detail_failed");
var _tbl_calibration_eccentricity_detail_incomplete = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_detail_incomplete");
var _tbl_calibration_eccentricity_detail_temp = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_detail_temp");
var _tbl_calibration_eccentricity_master = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_master");
var _tbl_calibration_eccentricity_master_failed = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_master_failed");
var _tbl_calibration_eccentricity_master_incomplete = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_master_incomplete");
var _tbl_calibration_eccentricity_master_temp = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_master_temp");
var _tbl_calibration_eccentricity_print = require("../models/Report/Calibration/Balance/Periodic/Eccentricity/tbl_calibration_eccentricity_print");
var _tbl_calibration_linearity_detail = require("../models/Report/Calibration/Balance/Periodic/Linearity/tbl_calibration_linearity_detail");
var _tbl_calibration_linearity_detail_failed = require("../models/Report/Calibration/Balance/Periodic/Linearity/tbl_calibration_linearity_detail_failed");
var _tbl_calibration_linearity_detail_incomplete = require("../models/Report/Calibration/Balance/Periodic/Linearity/tbl_calibration_linearity_detail_incomplete");
var _tbl_calibration_linearity_master = require("../models/Report/Calibration/Balance/Periodic/Linearity/tbl_calibration_linearity_master");
var _tbl_calibration_linearity_master_failed = require("../models/Report/Calibration/Balance/Periodic/Linearity/tbl_calibration_linearity_master_failed");
var _tbl_calibration_linearity_master_incomplete = require("../models/Report/Calibration/Balance/Periodic/Linearity/tbl_calibration_linearity_master_incomplete");
var _tbl_calibration_periodic_detail = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_detail");
var _tbl_calibration_periodic_detail_failed = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_detail_failed");
var _tbl_calibration_periodic_detail_incomplete = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_detail_incomplete");
var _tbl_calibration_periodic_detail_temp = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_detail_temp");
var _tbl_calibration_periodic_detail_vernier = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_detail_vernier");
var _tbl_calibration_periodic_detail_vernier_incomplete = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_detail_vernier_incomplete");
var _tbl_calibration_periodic_detail_vernier_temp = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_detail_vernier_temp");
var _tbl_calibration_periodic_master = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_master");
var _tbl_calibration_periodic_master_failed = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_master_failed");
var _tbl_calibration_periodic_master_incomplete = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_master_incomplete");
var _tbl_calibration_periodic_master_temp = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_master_temp");
var _tbl_calibration_periodic_master_vernier = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_master_vernier");
var _tbl_calibration_periodic_master_vernier_incomplete = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_master_vernier_incomplete");
var _tbl_calibration_periodic_master_vernier_temp = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_master_vernier_temp");
var _tbl_calibration_periodic_print = require("../models/Report/Calibration/Balance/Periodic/Periodic/tbl_calibration_periodic_print");
var _tbl_calibration_periodic_vernier_print = require("../models/Report/Calibration/Vernier/tbl_calibration_periodic_vernier_print");
var _tbl_calibration_positional_detail = require("../models/Report/Calibration/Balance/Periodic/Positional/tbl_calibration_positional_detail");
var _tbl_calibration_positional_detail_failed = require("../models/Report/Calibration/Balance/Periodic/Positional/tbl_calibration_positional_detail_failed");
var _tbl_calibration_positional_detail_incomplete = require("../models/Report/Calibration/Balance/Periodic/Positional/tbl_calibration_positional_detail_incomplete");
var _tbl_calibration_positional_master = require("../models/Report/Calibration/Balance/Periodic/Positional/tbl_calibration_positional_master");
var _tbl_calibration_positional_master_failed = require("../models/Report/Calibration/Balance/Periodic/Positional/tbl_calibration_positional_master_failed");
var _tbl_calibration_positional_master_incomplete = require("../models/Report/Calibration/Balance/Periodic/Positional/tbl_calibration_positional_master_incomplete");
var _tbl_calibration_repetability_detail = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_detail");
var _tbl_calibration_repetability_detail_failed = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_detail_failed");
var _tbl_calibration_repetability_detail_incomplete = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_detail_incomplete");
var _tbl_calibration_repetability_detail_temp = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_detail_temp");
var _tbl_calibration_repetability_master = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_master");
var _tbl_calibration_repetability_master_failed = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_master_failed");
var _tbl_calibration_repetability_master_incomplete = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_master_incomplete");
var _tbl_calibration_repetability_master_temp = require("../models/Report/Calibration/Balance/Periodic/Repeatability/tbl_calibration_repetability_master_temp");
var _tbl_calibration_sequnce = require("../models/Calibration/tbl_calibration_sequnce");
var _tbl_calibration_status = require("../models/Calibration/tbl_calibration_status");
var _tbl_calibration_status_bin = require("../models/Calibration/tbl_calibration_status_bin");
var _tbl_calibration_uncertinity_detail = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_detail");
var _tbl_calibration_uncertinity_detail_failed = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_detail_failed");
var _tbl_calibration_uncertinity_detail_incomplete = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_detail_incomplete");
var _tbl_calibration_uncertinity_detail_temp = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_detail_temp");
var _tbl_calibration_uncertinity_master = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_master");
var _tbl_calibration_uncertinity_master_failed = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_master_failed");
var _tbl_calibration_uncertinity_master_incomplete = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_master_incomplete");
var _tbl_calibration_uncertinity_master_temp = require("../models/Report/Calibration/Balance/Periodic/Uncertanity/tbl_calibration_uncertinity_master_temp");
var _tbl_calibrationbox = require("../models/Master/Calibration Standard/tbl_calibrationbox");
var _tbl_cubical = require("../models/Setting/System Setting/tbl_cubical");
var _tbl_cubical_nos = require("../models/Setting/System Setting/tbl_cubical_nos");
var _tbl_cubicle_area = require("../models/Setting/System Setting/tbl_cubicle_area");
var _tbl_cubicle_product_sample = require("../models/Setting/System Setting/tbl_cubicle_product_sample");
var _tbl_department = require("../models/Master/Department/tbl_department");
var _tbl_dtmedia = require("../models/Master/Media/tbl_dtmedia");
var _tbl_dynamicmenu = require("../models/Common/tbl_dynamicmenu");
var _tbl_edit_status = require("../models/Common/tbl_edit_status");
var _tbl_hardness_weight = require("../models/Master/Calibration Standard/tbl_hardness_weight");
var _tbl_instrumentlog_balance = require("../models/Report/Instrument Usage/tbl_instrumentlog_balance");
var _tbl_instrumentlog_hardness = require("../models/Report/Instrument Usage/tbl_instrumentlog_hardness");
var _tbl_instrumentlog_vernier = require("../models/Report/Instrument Usage/tbl_instrumentlog_vernier");
var _tbl_instrumentlog_lod = require("../models/Report/Instrument Usage/tbl_instrumentlog_lod");
var _tbl_lodmaster = require("../models/Report/Common Tablet-Capsule/tbl_lodmaster");
var _tbl_lodmaster_archived = require("../models/Report/Common Tablet-Capsule/tbl_lodmaster_archived");
var _tbl_machine = require("../models/Master/Machine/tbl_machine");
var _tbl_menulist = require("../models/Common/tbl_menulist");
var _tbl_nomenclature = require("../models/Common/tbl_nomenclature");
var _tbl_otherequipment = require("../models/Master/Instrument/Other/tbl_otherequipment");
var _tbl_powerbackup = require("../models/Report/Common Tablet-Capsule/tbl_powerbackup");
var _tbl_precalibration_daily = require("../models/Calibration/Weight Assignment/tbl_precalibration_daily");
var _tbl_precalibration_eccentricity = require("../models/Calibration/Weight Assignment/tbl_precalibration_eccentricity");
var _tbl_precalibration_linearity = require("../models/Calibration/Weight Assignment/tbl_precalibration_linearity");
var _tbl_precalibration_periodic = require("../models/Calibration/Weight Assignment/tbl_precalibration_periodic");
var _tbl_precalibration_repeatability = require("../models/Calibration/Weight Assignment/tbl_precalibration_repeatability");
var _tbl_precalibration_uncertainty = require("../models/Calibration/Weight Assignment/tbl_precalibration_uncertainty");
var _tbl_printoutreason_daily_calibration = require("../models/Report/Calibration/Balance/Daily/tbl_printoutreason_daily_calibration");
var _tbl_printoutreason_weighingreport = require("../models/Report/Common Tablet-Capsule/tbl_printoutreason_weighingreport");
var _tbl_product_capsule = require("../models/Master/Product/Capsule/tbl_product_capsule");
var _tbl_product_gran = require("../models/Master/Product/Granulation/tbl_product_gran");
var _tbl_product_gran_cap = require("../models/Master/Product/Granulation/tbl_product_gran_cap");
var _tbl_product_master = require("../models/Master/Product/tbl_product_master");
var _tbl_product_tablet = require("../models/Master/Product/Tablet/tbl_product_tablet");
var _tbl_product_tablet_coated = require("../models/Master/Product/Tablet/tbl_product_tablet_coated");
var _tbl_pwd_complexity = require("./Policy/Password Policy/tbl_pwd_complexity");
var _tbl_pwd_history = require("../models/Master/User/tbl_pwd_history");
var _tbl_recalibration_balance_status = require("../models/Calibration/Recalibration/tbl_recalibration_balance_status");
var _tbl_recalibration_balance_status_bin = require("../models/Calibration/Recalibration/tbl_recalibration_balance_status_bin");
var _tbl_recalibration_vernier_status = require("../models/Calibration/Recalibration/tbl_recalibration_vernier_status");
var _tbl_remark_incomplete_master = require("../models/Report/Calibration/Common/tbl_remark_incomplete_master");
var _tbl_reporttype_summary = require("../models/Report/Batch Summary/tbl_reporttype_summary");
var _tbl_rights = require("../models/Report/Role Log/tbl_rights");
var _tbl_rights_removed = require("../models/Report/Role Log/tbl_rights_removed");
var _tbl_rights_special = require("../models/Report/Role Log/tbl_rights_special");
var _tbl_role = require("../models/Report/Role Log/tbl_role");
var _tbl_rpi = require("../models/Setting/System Setting/tbl_rpi");
var _tbl_rpt_path = require("../models/Common/tbl_rpt_path");
var _tbl_setallparameter = require("../models/Policy/Set All Parameter/tbl_setallparameter");
var _tbl_sp_error_log = require("../models/Common/tbl_sp_error_log");
var _tbl_stages = require("../models/Master/Stage/tbl_stages");
var _tbl_system_weighingstatus = require("../models/Setting/tbl_system_weighingstatus");
var _tbl_tab_detail1 = require("../models/Report/Tablet/tbl_tab_detail1");
var _tbl_tab_detail1_archived = require("../models/Report/Tablet/tbl_tab_detail1_archived");
var _tbl_tab_detail1_incomplete = require("../models/Report/Tablet/tbl_tab_detail1_incomplete");
var _tbl_tab_detail2 = require("../models/Report/Tablet/tbl_tab_detail2");
var _tbl_tab_detail2_archived = require("../models/Report/Tablet/tbl_tab_detail2_archived");
var _tbl_tab_detail3 = require("../models/Report/Tablet/tbl_tab_detail3");
var _tbl_tab_detail3_archived = require("../models/Report/Tablet/tbl_tab_detail3_archived");
var _tbl_tab_detail3_incomplete = require("../models/Report/Tablet/tbl_tab_detail3_incomplete");
var _tbl_tab_detailhtd = require("../models/Report/Tablet/tbl_tab_detailhtd");
var _tbl_tab_detailhtd_archived = require("../models/Report/Tablet/tbl_tab_detailhtd_archived");
var _tbl_tab_detailhtd_incomplete = require("../models/Report/Tablet/tbl_tab_detailhtd_incomplete");
var _tbl_tab_master1 = require("../models/Report/Tablet/tbl_tab_master1");
var _tbl_tab_master1_archived = require("../models/Report/Tablet/tbl_tab_master1_archived");
var _tbl_tab_master1_incomplete = require("../models/Report/Tablet/tbl_tab_master1_incomplete");
var _tbl_tab_master2 = require("../models/Report/Tablet/tbl_tab_master2");
var _tbl_tab_master2_archived = require("../models/Report/Tablet/tbl_tab_master2_archived");
var _tbl_tab_master_htd = require("../models/Report/Tablet/tbl_tab_master_htd");
var _tbl_tab_master_htd_archived = require("../models/Report/Tablet/tbl_tab_master_htd_archived");
var _tbl_tab_master_htd_incomplete = require("../models/Report/Tablet/tbl_tab_master_htd_incomplete");
var _tbl_tab_print1 = require("../models/Report/Tablet/tbl_tab_print1");
var _tbl_tab_print2 = require("../models/Report/Tablet/tbl_tab_print2");
var _tbl_tab_print7 = require("../models/Report/Tablet/tbl_tab_print7");
var _tbl_temp_detail = require("../models/Report/Common Tablet-Capsule/tbl_temp_detail");
var _tbl_temp_detail_group = require("../models/Report/Common Tablet-Capsule/tbl_temp_detail_group");
var _tbl_temp_detail_htd = require("../models/Report/Common Tablet-Capsule/tbl_temp_detail_htd");
var _tbl_temp_master = require("../models/Report/Common Tablet-Capsule/tbl_temp_master");
var _tbl_temp_master_group = require("../models/Report/Common Tablet-Capsule/tbl_temp_master_group");
var _tbl_temp_master_htd = require("../models/Report/Common Tablet-Capsule/tbl_temp_master_htd");
var _tbl_temp_usage_instrument = require("../models/Report/Common Tablet-Capsule/tbl_temp_usage_instrument");
var _tbl_user_statusreport = require("../models/Report/User Status/tbl_user_statusreport");
var _tbl_users = require("../models/Master/User/tbl_users");
var _tbl_vernier = require("../models/Master/Instrument/Vernier/tbl_vernier");
var _tbl_vernier_blocks = require("../models/Master/Instrument/Vernier/tbl_vernier_blocks");
var _tbl_vernier_print = require("../models/Master/Instrument/Vernier/tbl_vernier_print");
var _test = require("../models/Common/test");

function initModels(sequelize) {
  var tbl_activity_log = _tbl_activity_log(sequelize, DataTypes);
  var tbl_alert_param_duration = _tbl_alert_param_duration(sequelize, DataTypes);
  var tbl_alert_weighing_detail = _tbl_alert_weighing_detail(sequelize, DataTypes);
  var tbl_alert_weighing_master = _tbl_alert_weighing_master(sequelize, DataTypes);
  var tbl_archive_log = _tbl_archive_log(sequelize, DataTypes);
  var tbl_area_cubicletype = _tbl_area_cubicletype(sequelize, DataTypes);
  var tbl_assignedrolewithright = _tbl_assignedrolewithright(sequelize, DataTypes);
  var tbl_audit_admin_password = _tbl_audit_admin_password(sequelize, DataTypes);
  var tbl_audit_adminname = _tbl_audit_adminname(sequelize, DataTypes);
  var tbl_audit_alertsetting = _tbl_audit_alertsetting(sequelize, DataTypes);
  var tbl_audit_all_periods = _tbl_audit_all_periods(sequelize, DataTypes);
  var tbl_audit_areasetting = _tbl_audit_areasetting(sequelize, DataTypes);
  var tbl_audit_bal_setting = _tbl_audit_bal_setting(sequelize, DataTypes);
  var tbl_audit_calibration = _tbl_audit_calibration(sequelize, DataTypes);
  var tbl_audit_calibrationbox = _tbl_audit_calibrationbox(sequelize, DataTypes);
  var tbl_audit_change_password = _tbl_audit_change_password(sequelize, DataTypes);
  var tbl_audit_cubicle = _tbl_audit_cubicle(sequelize, DataTypes);
  var tbl_audit_department = _tbl_audit_department(sequelize, DataTypes);
  var tbl_audit_dtmedia = _tbl_audit_dtmedia(sequelize, DataTypes);
  var tbl_audit_machine = _tbl_audit_machine(sequelize, DataTypes);
  var tbl_audit_other_equipment = _tbl_audit_other_equipment(sequelize, DataTypes);
  var tbl_audit_portsetting = _tbl_audit_portsetting(sequelize, DataTypes);
  var tbl_audit_precalibration = _tbl_audit_precalibration(sequelize, DataTypes);
  var tbl_audit_product = _tbl_audit_product(sequelize, DataTypes);
  var tbl_audit_product_capsule = _tbl_audit_product_capsule(sequelize, DataTypes);
  var tbl_audit_pwd_complexity = _tbl_audit_pwd_complexity(sequelize, DataTypes);
  var tbl_audit_recalibration = _tbl_audit_recalibration(sequelize, DataTypes);
  var tbl_audit_role = _tbl_audit_role(sequelize, DataTypes);
  var tbl_audit_stages = _tbl_audit_stages(sequelize, DataTypes);
  var tbl_audit_unauthorized_user = _tbl_audit_unauthorized_user(sequelize, DataTypes);
  var tbl_audit_user_chgpwdown = _tbl_audit_user_chgpwdown(sequelize, DataTypes);
  var tbl_audit_userpwd = _tbl_audit_userpwd(sequelize, DataTypes);
  var tbl_audit_users = _tbl_audit_users(sequelize, DataTypes);
  var tbl_audit_vernier = _tbl_audit_vernier(sequelize, DataTypes);
  var tbl_balance = _tbl_balance(sequelize, DataTypes);
  var tbl_balance_weights = _tbl_balance_weights(sequelize, DataTypes);
  var tbl_batches = _tbl_batches(sequelize, DataTypes);
  var tbl_batchsummary = _tbl_batchsummary(sequelize, DataTypes);
  var tbl_batchsummary_detail1 = _tbl_batchsummary_detail1(sequelize, DataTypes);
  var tbl_batchsummary_detail_hdlb = _tbl_batchsummary_detail_hdlb(sequelize, DataTypes);
  var tbl_batchsummary_detail_hdlb_temp = _tbl_batchsummary_detail_hdlb_temp(sequelize, DataTypes);
  var tbl_batchsummary_detail_temp = _tbl_batchsummary_detail_temp(sequelize, DataTypes);
  var tbl_batchsummary_master1 = _tbl_batchsummary_master1(sequelize, DataTypes);
  var tbl_batchsummary_master_hdlb = _tbl_batchsummary_master_hdlb(sequelize, DataTypes);
  var tbl_batchsummary_master_hdlb_temp = _tbl_batchsummary_master_hdlb_temp(sequelize, DataTypes);
  var tbl_batchsummary_master_temp = _tbl_batchsummary_master_temp(sequelize, DataTypes);
  var tbl_batchsummary_printrecord = _tbl_batchsummary_printrecord(sequelize, DataTypes);
  var tbl_calibration_daily_detail = _tbl_calibration_daily_detail(sequelize, DataTypes);
  var tbl_calibration_daily_detail_incomplete = _tbl_calibration_daily_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_daily_master = _tbl_calibration_daily_master(sequelize, DataTypes);
  var tbl_calibration_daily_master_incomplete = _tbl_calibration_daily_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_daily_noremark = _tbl_calibration_daily_noremark(sequelize, DataTypes);
  var tbl_calibration_daily_print = _tbl_calibration_daily_print(sequelize, DataTypes);
  var tbl_calibration_eccentricity_detail = _tbl_calibration_eccentricity_detail(sequelize, DataTypes);
  var tbl_calibration_eccentricity_detail_failed = _tbl_calibration_eccentricity_detail_failed(sequelize, DataTypes);
  var tbl_calibration_eccentricity_detail_incomplete = _tbl_calibration_eccentricity_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_eccentricity_detail_temp = _tbl_calibration_eccentricity_detail_temp(sequelize, DataTypes);
  var tbl_calibration_eccentricity_master = _tbl_calibration_eccentricity_master(sequelize, DataTypes);
  var tbl_calibration_eccentricity_master_failed = _tbl_calibration_eccentricity_master_failed(sequelize, DataTypes);
  var tbl_calibration_eccentricity_master_incomplete = _tbl_calibration_eccentricity_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_eccentricity_master_temp = _tbl_calibration_eccentricity_master_temp(sequelize, DataTypes);
  var tbl_calibration_eccentricity_print = _tbl_calibration_eccentricity_print(sequelize, DataTypes);
  var tbl_calibration_linearity_detail = _tbl_calibration_linearity_detail(sequelize, DataTypes);
  var tbl_calibration_linearity_detail_failed = _tbl_calibration_linearity_detail_failed(sequelize, DataTypes);
  var tbl_calibration_linearity_detail_incomplete = _tbl_calibration_linearity_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_linearity_master = _tbl_calibration_linearity_master(sequelize, DataTypes);
  var tbl_calibration_linearity_master_failed = _tbl_calibration_linearity_master_failed(sequelize, DataTypes);
  var tbl_calibration_linearity_master_incomplete = _tbl_calibration_linearity_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_periodic_detail = _tbl_calibration_periodic_detail(sequelize, DataTypes);
  var tbl_calibration_periodic_detail_failed = _tbl_calibration_periodic_detail_failed(sequelize, DataTypes);
  var tbl_calibration_periodic_detail_incomplete = _tbl_calibration_periodic_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_periodic_detail_temp = _tbl_calibration_periodic_detail_temp(sequelize, DataTypes);
  var tbl_calibration_periodic_detail_vernier = _tbl_calibration_periodic_detail_vernier(sequelize, DataTypes);
  var tbl_calibration_periodic_detail_vernier_incomplete = _tbl_calibration_periodic_detail_vernier_incomplete(sequelize, DataTypes);
  var tbl_calibration_periodic_detail_vernier_temp = _tbl_calibration_periodic_detail_vernier_temp(sequelize, DataTypes);
  var tbl_calibration_periodic_master = _tbl_calibration_periodic_master(sequelize, DataTypes);
  var tbl_calibration_periodic_master_failed = _tbl_calibration_periodic_master_failed(sequelize, DataTypes);
  var tbl_calibration_periodic_master_incomplete = _tbl_calibration_periodic_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_periodic_master_temp = _tbl_calibration_periodic_master_temp(sequelize, DataTypes);
  var tbl_calibration_periodic_master_vernier = _tbl_calibration_periodic_master_vernier(sequelize, DataTypes);
  var tbl_calibration_periodic_master_vernier_incomplete = _tbl_calibration_periodic_master_vernier_incomplete(sequelize, DataTypes);
  var tbl_calibration_periodic_master_vernier_temp = _tbl_calibration_periodic_master_vernier_temp(sequelize, DataTypes);
  var tbl_calibration_periodic_print = _tbl_calibration_periodic_print(sequelize, DataTypes);
  var tbl_calibration_periodic_vernier_print = _tbl_calibration_periodic_vernier_print(sequelize, DataTypes);
  var tbl_calibration_positional_detail = _tbl_calibration_positional_detail(sequelize, DataTypes);
  var tbl_calibration_positional_detail_failed = _tbl_calibration_positional_detail_failed(sequelize, DataTypes);
  var tbl_calibration_positional_detail_incomplete = _tbl_calibration_positional_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_positional_master = _tbl_calibration_positional_master(sequelize, DataTypes);
  var tbl_calibration_positional_master_failed = _tbl_calibration_positional_master_failed(sequelize, DataTypes);
  var tbl_calibration_positional_master_incomplete = _tbl_calibration_positional_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_repetability_detail = _tbl_calibration_repetability_detail(sequelize, DataTypes);
  var tbl_calibration_repetability_detail_failed = _tbl_calibration_repetability_detail_failed(sequelize, DataTypes);
  var tbl_calibration_repetability_detail_incomplete = _tbl_calibration_repetability_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_repetability_detail_temp = _tbl_calibration_repetability_detail_temp(sequelize, DataTypes);
  var tbl_calibration_repetability_master = _tbl_calibration_repetability_master(sequelize, DataTypes);
  var tbl_calibration_repetability_master_failed = _tbl_calibration_repetability_master_failed(sequelize, DataTypes);
  var tbl_calibration_repetability_master_incomplete = _tbl_calibration_repetability_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_repetability_master_temp = _tbl_calibration_repetability_master_temp(sequelize, DataTypes);
  var tbl_calibration_sequnce = _tbl_calibration_sequnce(sequelize, DataTypes);
  var tbl_calibration_status = _tbl_calibration_status(sequelize, DataTypes);
  var tbl_calibration_status_bin = _tbl_calibration_status_bin(sequelize, DataTypes);
  var tbl_calibration_uncertinity_detail = _tbl_calibration_uncertinity_detail(sequelize, DataTypes);
  var tbl_calibration_uncertinity_detail_failed = _tbl_calibration_uncertinity_detail_failed(sequelize, DataTypes);
  var tbl_calibration_uncertinity_detail_incomplete = _tbl_calibration_uncertinity_detail_incomplete(sequelize, DataTypes);
  var tbl_calibration_uncertinity_detail_temp = _tbl_calibration_uncertinity_detail_temp(sequelize, DataTypes);
  var tbl_calibration_uncertinity_master = _tbl_calibration_uncertinity_master(sequelize, DataTypes);
  var tbl_calibration_uncertinity_master_failed = _tbl_calibration_uncertinity_master_failed(sequelize, DataTypes);
  var tbl_calibration_uncertinity_master_incomplete = _tbl_calibration_uncertinity_master_incomplete(sequelize, DataTypes);
  var tbl_calibration_uncertinity_master_temp = _tbl_calibration_uncertinity_master_temp(sequelize, DataTypes);
  var tbl_calibrationbox = _tbl_calibrationbox(sequelize, DataTypes);
  var tbl_cubical = _tbl_cubical(sequelize, DataTypes);
  var tbl_cubical_nos = _tbl_cubical_nos(sequelize, DataTypes);
  var tbl_cubicle_area = _tbl_cubicle_area(sequelize, DataTypes);
  var tbl_cubicle_product_sample = _tbl_cubicle_product_sample(sequelize, DataTypes);
  var tbl_department = _tbl_department(sequelize, DataTypes);
  var tbl_dtmedia = _tbl_dtmedia(sequelize, DataTypes);
  var tbl_dynamicmenu = _tbl_dynamicmenu(sequelize, DataTypes);
  var tbl_edit_status = _tbl_edit_status(sequelize, DataTypes);
  var tbl_hardness_weight = _tbl_hardness_weight(sequelize, DataTypes);
  var tbl_instrumentlog_balance = _tbl_instrumentlog_balance(sequelize, DataTypes);
  var tbl_instrumentlog_hardness = _tbl_instrumentlog_hardness(sequelize, DataTypes);
  var tbl_instrumentlog_vernier = _tbl_instrumentlog_vernier(sequelize, DataTypes);
  var tbl_instrumentlog_lod = _tbl_instrumentlog_lod(sequelize, DataTypes);
  var tbl_lodmaster = _tbl_lodmaster(sequelize, DataTypes);
  var tbl_lodmaster_archived = _tbl_lodmaster_archived(sequelize, DataTypes);
  var tbl_machine = _tbl_machine(sequelize, DataTypes);
  var tbl_menulist = _tbl_menulist(sequelize, DataTypes);
  var tbl_nomenclature = _tbl_nomenclature(sequelize, DataTypes);
  var tbl_otherequipment = _tbl_otherequipment(sequelize, DataTypes);
  var tbl_powerbackup = _tbl_powerbackup(sequelize, DataTypes);
  var tbl_precalibration_daily = _tbl_precalibration_daily(sequelize, DataTypes);
  var tbl_precalibration_eccentricity = _tbl_precalibration_eccentricity(sequelize, DataTypes);
  var tbl_precalibration_linearity = _tbl_precalibration_linearity(sequelize, DataTypes);
  var tbl_precalibration_periodic = _tbl_precalibration_periodic(sequelize, DataTypes);
  var tbl_precalibration_repeatability = _tbl_precalibration_repeatability(sequelize, DataTypes);
  var tbl_precalibration_uncertainty = _tbl_precalibration_uncertainty(sequelize, DataTypes);
  var tbl_printoutreason_daily_calibration = _tbl_printoutreason_daily_calibration(sequelize, DataTypes);
  var tbl_printoutreason_weighingreport = _tbl_printoutreason_weighingreport(sequelize, DataTypes);
  var tbl_product_capsule = _tbl_product_capsule(sequelize, DataTypes);
  var tbl_product_gran = _tbl_product_gran(sequelize, DataTypes);
  var tbl_product_gran_cap = _tbl_product_gran_cap(sequelize, DataTypes);
  var tbl_product_master = _tbl_product_master(sequelize, DataTypes);
  var tbl_product_tablet = _tbl_product_tablet(sequelize, DataTypes);
  var tbl_product_tablet_coated = _tbl_product_tablet_coated(sequelize, DataTypes);
  var tbl_pwd_complexity = _tbl_pwd_complexity(sequelize, DataTypes);
  var tbl_pwd_history = _tbl_pwd_history(sequelize, DataTypes);
  var tbl_recalibration_balance_status = _tbl_recalibration_balance_status(sequelize, DataTypes);
  var tbl_recalibration_balance_status_bin = _tbl_recalibration_balance_status_bin(sequelize, DataTypes);
  var tbl_recalibration_vernier_status = _tbl_recalibration_vernier_status(sequelize, DataTypes);
  var tbl_remark_incomplete_master = _tbl_remark_incomplete_master(sequelize, DataTypes);
  var tbl_reporttype_summary = _tbl_reporttype_summary(sequelize, DataTypes);
  var tbl_rights = _tbl_rights(sequelize, DataTypes);
  var tbl_rights_removed = _tbl_rights_removed(sequelize, DataTypes);
  var tbl_rights_special = _tbl_rights_special(sequelize, DataTypes);
  var tbl_role = _tbl_role(sequelize, DataTypes);
  var tbl_rpi = _tbl_rpi(sequelize, DataTypes);
  var tbl_rpt_path = _tbl_rpt_path(sequelize, DataTypes);
  var tbl_setallparameter = _tbl_setallparameter(sequelize, DataTypes);
  var tbl_sp_error_log = _tbl_sp_error_log(sequelize, DataTypes);
  var tbl_stages = _tbl_stages(sequelize, DataTypes);
  var tbl_system_weighingstatus = _tbl_system_weighingstatus(sequelize, DataTypes);
  var tbl_tab_detail1 = _tbl_tab_detail1(sequelize, DataTypes);
  var tbl_tab_detail1_archived = _tbl_tab_detail1_archived(sequelize, DataTypes);
  var tbl_tab_detail1_incomplete = _tbl_tab_detail1_incomplete(sequelize, DataTypes);
  var tbl_tab_detail2 = _tbl_tab_detail2(sequelize, DataTypes);
  var tbl_tab_detail2_archived = _tbl_tab_detail2_archived(sequelize, DataTypes);
  var tbl_tab_detail3 = _tbl_tab_detail3(sequelize, DataTypes);
  var tbl_tab_detail3_archived = _tbl_tab_detail3_archived(sequelize, DataTypes);
  var tbl_tab_detail3_incomplete = _tbl_tab_detail3_incomplete(sequelize, DataTypes);
  var tbl_tab_detailhtd = _tbl_tab_detailhtd(sequelize, DataTypes);
  var tbl_tab_detailhtd_archived = _tbl_tab_detailhtd_archived(sequelize, DataTypes);
  var tbl_tab_detailhtd_incomplete = _tbl_tab_detailhtd_incomplete(sequelize, DataTypes);
  var tbl_tab_master1 = _tbl_tab_master1(sequelize, DataTypes);
  var tbl_tab_master1_archived = _tbl_tab_master1_archived(sequelize, DataTypes);
  var tbl_tab_master1_incomplete = _tbl_tab_master1_incomplete(sequelize, DataTypes);
  var tbl_tab_master2 = _tbl_tab_master2(sequelize, DataTypes);
  var tbl_tab_master2_archived = _tbl_tab_master2_archived(sequelize, DataTypes);
  var tbl_tab_master_htd = _tbl_tab_master_htd(sequelize, DataTypes);
  var tbl_tab_master_htd_archived = _tbl_tab_master_htd_archived(sequelize, DataTypes);
  var tbl_tab_master_htd_incomplete = _tbl_tab_master_htd_incomplete(sequelize, DataTypes);
  var tbl_tab_print1 = _tbl_tab_print1(sequelize, DataTypes);
  var tbl_tab_print2 = _tbl_tab_print2(sequelize, DataTypes);
  var tbl_tab_print7 = _tbl_tab_print7(sequelize, DataTypes);
  var tbl_temp_detail = _tbl_temp_detail(sequelize, DataTypes);
  var tbl_temp_detail_group = _tbl_temp_detail_group(sequelize, DataTypes);
  var tbl_temp_detail_htd = _tbl_temp_detail_htd(sequelize, DataTypes);
  var tbl_temp_master = _tbl_temp_master(sequelize, DataTypes);
  var tbl_temp_master_group = _tbl_temp_master_group(sequelize, DataTypes);
  var tbl_temp_master_htd = _tbl_temp_master_htd(sequelize, DataTypes);
  var tbl_temp_usage_instrument = _tbl_temp_usage_instrument(sequelize, DataTypes);
  var tbl_user_statusreport = _tbl_user_statusreport(sequelize, DataTypes);
  var tbl_users = _tbl_users(sequelize, DataTypes);
  var tbl_vernier = _tbl_vernier(sequelize, DataTypes);
  var tbl_vernier_blocks = _tbl_vernier_blocks(sequelize, DataTypes);
  var tbl_vernier_print = _tbl_vernier_print(sequelize, DataTypes);
  var test = _test(sequelize, DataTypes);


  return {
    tbl_activity_log,
    tbl_alert_param_duration,
    tbl_alert_weighing_detail,
    tbl_alert_weighing_master,
    tbl_archive_log,
    tbl_area_cubicletype,
    tbl_assignedrolewithright,
    tbl_audit_admin_password,
    tbl_audit_adminname,
    tbl_audit_alertsetting,
    tbl_audit_all_periods,
    tbl_audit_areasetting,
    tbl_audit_bal_setting,
    tbl_audit_calibration,
    tbl_audit_calibrationbox,
    tbl_audit_change_password,
    tbl_audit_cubicle,
    tbl_audit_department,
    tbl_audit_dtmedia,
    tbl_audit_machine,
    tbl_audit_other_equipment,
    tbl_audit_portsetting,
    tbl_audit_precalibration,
    tbl_audit_product,
    tbl_audit_product_capsule,
    tbl_audit_pwd_complexity,
    tbl_audit_recalibration,
    tbl_audit_role,
    tbl_audit_stages,
    tbl_audit_unauthorized_user,
    tbl_audit_user_chgpwdown,
    tbl_audit_userpwd,
    tbl_audit_users,
    tbl_audit_vernier,
    tbl_balance,
    tbl_balance_weights,
    tbl_batches,
    tbl_batchsummary,
    tbl_batchsummary_detail1,
    tbl_batchsummary_detail_hdlb,
    tbl_batchsummary_detail_hdlb_temp,
    tbl_batchsummary_detail_temp,
    tbl_batchsummary_master1,
    tbl_batchsummary_master_hdlb,
    tbl_batchsummary_master_hdlb_temp,
    tbl_batchsummary_master_temp,
    tbl_batchsummary_printrecord,
    tbl_calibration_daily_detail,
    tbl_calibration_daily_detail_incomplete,
    tbl_calibration_daily_master,
    tbl_calibration_daily_master_incomplete,
    tbl_calibration_daily_noremark,
    tbl_calibration_daily_print,
    tbl_calibration_eccentricity_detail,
    tbl_calibration_eccentricity_detail_failed,
    tbl_calibration_eccentricity_detail_incomplete,
    tbl_calibration_eccentricity_detail_temp,
    tbl_calibration_eccentricity_master,
    tbl_calibration_eccentricity_master_failed,
    tbl_calibration_eccentricity_master_incomplete,
    tbl_calibration_eccentricity_master_temp,
    tbl_calibration_eccentricity_print,
    tbl_calibration_linearity_detail,
    tbl_calibration_linearity_detail_failed,
    tbl_calibration_linearity_detail_incomplete,
    tbl_calibration_linearity_master,
    tbl_calibration_linearity_master_failed,
    tbl_calibration_linearity_master_incomplete,
    tbl_calibration_periodic_detail,
    tbl_calibration_periodic_detail_failed,
    tbl_calibration_periodic_detail_incomplete,
    tbl_calibration_periodic_detail_temp,
    tbl_calibration_periodic_detail_vernier,
    tbl_calibration_periodic_detail_vernier_incomplete,
    tbl_calibration_periodic_detail_vernier_temp,
    tbl_calibration_periodic_master,
    tbl_calibration_periodic_master_failed,
    tbl_calibration_periodic_master_incomplete,
    tbl_calibration_periodic_master_temp,
    tbl_calibration_periodic_master_vernier,
    tbl_calibration_periodic_master_vernier_incomplete,
    tbl_calibration_periodic_master_vernier_temp,
    tbl_calibration_periodic_print,
    tbl_calibration_periodic_vernier_print,
    tbl_calibration_positional_detail,
    tbl_calibration_positional_detail_failed,
    tbl_calibration_positional_detail_incomplete,
    tbl_calibration_positional_master,
    tbl_calibration_positional_master_failed,
    tbl_calibration_positional_master_incomplete,
    tbl_calibration_repetability_detail,
    tbl_calibration_repetability_detail_failed,
    tbl_calibration_repetability_detail_incomplete,
    tbl_calibration_repetability_detail_temp,
    tbl_calibration_repetability_master,
    tbl_calibration_repetability_master_failed,
    tbl_calibration_repetability_master_incomplete,
    tbl_calibration_repetability_master_temp,
    tbl_calibration_sequnce,
    tbl_calibration_status,
    tbl_calibration_status_bin,
    tbl_calibration_uncertinity_detail,
    tbl_calibration_uncertinity_detail_failed,
    tbl_calibration_uncertinity_detail_incomplete,
    tbl_calibration_uncertinity_detail_temp,
    tbl_calibration_uncertinity_master,
    tbl_calibration_uncertinity_master_failed,
    tbl_calibration_uncertinity_master_incomplete,
    tbl_calibration_uncertinity_master_temp,
    tbl_calibrationbox,
    tbl_cubical,
    tbl_cubical_nos,
    tbl_cubicle_area,
    tbl_cubicle_product_sample,
    tbl_department,
    tbl_dtmedia,
    tbl_dynamicmenu,
    tbl_edit_status,
    tbl_hardness_weight,
    tbl_instrumentlog_balance,
    tbl_instrumentlog_hardness,
    tbl_instrumentlog_vernier,
    tbl_instrumentlog_lod,
    tbl_lodmaster,
    tbl_lodmaster_archived,
    tbl_machine,
    tbl_menulist,
    tbl_nomenclature,
    tbl_otherequipment,
    tbl_powerbackup,
    tbl_precalibration_daily,
    tbl_precalibration_eccentricity,
    tbl_precalibration_linearity,
    tbl_precalibration_periodic,
    tbl_precalibration_repeatability,
    tbl_precalibration_uncertainty,
    tbl_printoutreason_daily_calibration,
    tbl_printoutreason_weighingreport,
    tbl_product_capsule,
    tbl_product_gran,
    tbl_product_gran_cap,
    tbl_product_master,
    tbl_product_tablet,
    tbl_product_tablet_coated,
    tbl_pwd_complexity,
    tbl_pwd_history,
    tbl_recalibration_balance_status,
    tbl_recalibration_balance_status_bin,
    tbl_recalibration_vernier_status,
    tbl_remark_incomplete_master,
    tbl_reporttype_summary,
    tbl_rights,
    tbl_rights_removed,
    tbl_rights_special,
    tbl_role,
    tbl_rpi,
    tbl_rpt_path,
    tbl_setallparameter,
    tbl_sp_error_log,
    tbl_stages,
    tbl_system_weighingstatus,
    tbl_tab_detail1,
    tbl_tab_detail1_archived,
    tbl_tab_detail1_incomplete,
    tbl_tab_detail2,
    tbl_tab_detail2_archived,
    tbl_tab_detail3,
    tbl_tab_detail3_archived,
    tbl_tab_detail3_incomplete,
    tbl_tab_detailhtd,
    tbl_tab_detailhtd_archived,
    tbl_tab_detailhtd_incomplete,
    tbl_tab_master1,
    tbl_tab_master1_archived,
    tbl_tab_master1_incomplete,
    tbl_tab_master2,
    tbl_tab_master2_archived,
    tbl_tab_master_htd,
    tbl_tab_master_htd_archived,
    tbl_tab_master_htd_incomplete,
    tbl_tab_print1,
    tbl_tab_print2,
    tbl_tab_print7,
    tbl_temp_detail,
    tbl_temp_detail_group,
    tbl_temp_detail_htd,
    tbl_temp_master,
    tbl_temp_master_group,
    tbl_temp_master_htd,
    tbl_temp_usage_instrument,
    tbl_user_statusreport,
    tbl_users,
    tbl_vernier,
    tbl_vernier_blocks,
    tbl_vernier_print,
    test,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
