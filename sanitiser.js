var sanitiser = {
    isValidFile: function(file) {
        try{
            // split into csv
            var csv = file.split(',');
            if (!(csv[0] === "93" && csv[1] === "0" && csv[2] === "0" && csv[3] === "32")){
                throw new Error();
            }
        } catch (error) {
            return false;
        }
        
        return true;
    }
}

module.exports = sanitiser;