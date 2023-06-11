function init() {
    d3.json("http://127.0.0.1:5000/LAX_data").then(function (data) {
        var LAX_data = data;
        console.log(LAX_data);
        // Further code using the LAX data can be placed here
    });

    d3.json("http://127.0.0.1:5000/SFO_data").then(function (data) {
        var SFO_data = data;
        console.log(SFO_data);
        // Further code using the SFO data can be placed here
    });

    d3.json("http://127.0.0.1:5000/SAN_data").then(function (data) {
        var SAN_data = data;
        console.log(SAN_data);
        // Further code using the SAN data can be placed here
    });
}

init();