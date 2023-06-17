const Database = require('../../database/clsQueryProcess');
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize')
const objDatabase = new Database();
/**
 * @description to get tbl_product_tablet data
 */
class ProductDetail {
  async productData(productObj, temptblName = '') {
    try {
      var productMasterData = await models.tbl_product_master.findAll({
        where: {
          ProductId:productObj.Sys_BFGCode,
          ProductName: productObj.Sys_ProductName,
          ProductVersion: productObj.Sys_PVersion,
          Version: productObj.Sys_Version,
        }
      })


      var masterData = [productMasterData];
      var result = [];
      let str_tableName;
      let Str_TableName;
      var productType = masterData[0][0].ProductType;
      if (productObj.Sys_Area == "Effervescent Granulation" || productObj.Sys_Area == "Granulation") {
        if (productType == 1) {
          // Str_TableName = "tbl_product_gran";
          str_tableName = models.tbl_product_gran
        } else {
          // str_tableName = "tbl_product_gran_cap";
          str_tableName = models.tbl_product_gran_cap
        }
      } else if (productObj.Batch == "Coating") {
        // str_tableName = "tbl_product_tablet_coated";
        str_tableName = models.tbl_product_tablet_coated
      } else if (productObj.Batch == "Pallet Coating") {
        if (temptblName == "") {
          // str_tableName = "tbl_product_gran_cap";
          str_tableName = models.tbl_product_gran_cap
        } else {
          // str_tableName = temptblName;
          str_tableName = temptblName
        }
      } else if (productObj.Sys_Area == "Capsule Filling") {
        // str_tableName = "tbl_product_capsule";
        str_tableName = models.tbl_product_capsule
      } else if (productObj.Batch == "Multihaler") {
        // str_tableName = "tbl_product_multihaler";
        str_tableName = models.tbl_product_multihaler
      } else if (productObj.Batch == "Softshell") {
        // str_tableName = "tbl_product_softshell";
        str_tableName = models.tbl_product_softshell
      } else if (productObj.Batch == "Dosa Dry Syrup") {
        // str_tableName = "tbl_product_dosadry";
        str_tableName = models.tbl_product_dosadry
      } else if (productObj.Batch.includes("IPQA")) {
        if (productObj.Sys_IPQCType == "Capsule Filling") {
          // str_tableName = "tbl_product_capsule";
          str_tableName = models.tbl_product_capsule
        } else if (productObj.Sys_IPQCType == "Coating") {
          // str_tableName = "tbl_product_tablet_coated";
          str_tableName = models.tbl_product_tablet_coated
        } else {
          // str_tableName = "tbl_product_tablet";
          str_tableName = models.tbl_product_tablet
        }
      } else {
        // str_tableName = "tbl_product_tablet";
        str_tableName = models.tbl_product_tablet
      }
      var productData = await models[str_tableName.tableName].findAll({
        where: {
          ProductId:productObj.Sys_BFGCode,
          ProductName: productObj.Sys_ProductName,
          ProductVersion: productObj.ProductVersion,
          Version: productObj.Sys_PVersion,
        }
      })

      var resultData = [productData];
      result.push(masterData[0][0], resultData[0][0])
      return result;


    } catch (err) {
      throw new Error(err);
    }
  }

}
module.exports = ProductDetail;