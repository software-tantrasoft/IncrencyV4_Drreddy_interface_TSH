class IOPCTags {

    constructor() {
        this.BalanceTags = {
            TestName : "",
            ProductName : "",
            TestStart : "",
            NoOfSample_GrpWt : 0,
            NoOfSample_IndiWt : 0,
            BatchNo : "",
            Side : "",
            ActMaximumGrpWeight : 0,
            ActMinimumGrpWeight : 0,
            AverageGrpWeight : 0,
            ActMaximumIndiWeight : 0,
            ActMinimumIndiWeight : 0,
            AverageIndiWeight : 0,
            TestResult_GrpWtVariation : false,
            TestResult_IndiWtVariation : false,
            TestEnd : "",
            Lot: "",
            AverageValue : 0
        }
        this.VernierTags = {
            ActMaximumBreadth : 0,
            ActMaximumDiameter : 0,
            ActMaximumLength : 0,
            ActMaximumThickness : 0,
            ActMinimumBreadth : 0,
            ActMinimumDiameter : 0,
            ActMinimumLength : 0,
            ActMinimumThickness : 0,
            AverageBreadth : 0,
            AverageDiameter : 0,
            AverageLength : 0,
            AverageThickness : 0,
            BatchNo:"",
            Lot:"",
            NoOfSample_Breadth:0,
            NoOfSample_Diameter:0,
            NoOfSample_Length:0,
            NoOfSample_Thickness:0,
            ProductName:"",
            Side:"",
            TestEnd:"",
            TestName:"",
            TestResult_Breadth:false,
            TestResult_Diameter:false,
            TestResult_Length:false,
            TestResult_Thickness:false,
            TestStart:"",
            
        }
        this.MATags = {
            BatchNo : "",
            TestStart : "",
            SetDryingTemp : 0,
            TestEnd : "",
            FinalWeight : 0,
            Layer : "",
            ActLossOnDrying : 0,
            Lot : 0,
            ProdName : "",
            TestResult : "",
            Stage : "",
            StartWeight : "",
            TestName:""
        }
        this.HTTags = {
            ActMaximumDiameter : 0,
            ActMaximumHardness : 0,
            ActMaximumlength : 0,
            ActMaximumThickness : 0,
            ActMinimumDiameter : 0,
            ActMinimumHardness : 0,
            ActMinimumlength : 0,
            ActMinimumThickness : 0,
            AverageDiameter : 0,
            AverageHardness : 0,
            Averagelength : 0,
            AverageThickness : 0,
            BatchNo:"",
            Lot:"",
            NoOfSample:0,
            ProductName:"",
            Side:"",
            TestEnd:"",
            TestName:"",
            TestResultDiameter:false,
            TestResultHardness:false,
            TestResultlength:false,
            TestResultThickness:false,
            TestStart:""
        }
        this.FribltyTags = {
            ActFriabilityLHS : 0,
            ActFriabilityRHS : 0,
            ActualCount  :0,
            ActualRpm : 0,
            BatchNo : "",
            Lot : "",
            NoOfSample : 0,
            ProductName : "",
            Side : "",
            TestEnd : "",
            TestName : "",
            TestResult : false,
            TestStart:"",
            WeightAfterTestLHS:0,
            WeightBeforeTestLHS:0,
            WeightAfterTestRHS:0,
            WeightBeforeTestRHS:0,
        }
        this.DTTags = {
            ActMaximumTemp : 0,
            ActMaxTimeLHS  :"",
            ActMaxTimeRHS : "",
            ActMinimumTemp : 0,
            BatchNo : "",
            Lot : "",
            NoOfSample : 0,
            ProductName : "",
            Side : "",
            TestEnd : "",
            TestName : "",
            TestResult : false,
            TestStart:"",
        }
        this.TDTTags = {
            TestName:"",
            ProductName:"",
            TestStart:"",
            QuantityOfSample:0,
            BatchNo:"",
            TestResult:false,
            TestEnd:"",
            Lot:"",
            VolumeOccupiedVo:0,
            TappedDensity:0,
            TappedvolumeV10:0,
            TappedvolumeV500:0,
            TappedvolumeV1250a:0,
            TappedvolumeV1250b:0,
            TappedvolumeV1250c:0,
            Method:"",
            Layer:""

        }
        this.SSTags = {
            TestName:"",
            ProductName:"",
            TestStart:"",
            QuantityOfSample:0,
            BatchNo:"",
            PerFine:0,
            TestResult:false,
            QuantityAbove20Mesh:0,
            QuantityAbove40Mesh:0,
            QuantityAbove60Mesh:0,
            QuantityAbove80Mesh:0,
            QuantityAbove100Mesh:0,
            FinesOnTheColectngtray:0,
            TestSamplePerFine:0,
            perFineAbove20Mesh:0,
            PerFineAbove40Mesh:0,
            PerFineAbove60Mesh:0,
            PerFineAbove80Mesh:0,
            PerFineAbove100Mesh:0,
            PerFineOnTheColectngtray:0,
            Lot:""
        }

    }


    
}

module.exports = IOPCTags;