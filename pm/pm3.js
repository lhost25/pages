const path = require('path')
const childProcess = require('child_process');
const express = require('express')
const app = express()
const port = 3000


// keep track of whether callback has been invoked to prevent multiple invocations
let invoked = false;

let psX = null; 



app.get('/start', (req, res) => {
    console.log("Stating Application nkp.....")
    startApp(res)
})


app.get('/stop', (req, res) => {
    console.log("Stoppiing Application nkp.....")
    stopApp(res)
})

app.get('/restart', (req, res) => {
    
    restartApp(res)
})

app.get('/status', (req, res) => {
    if (psX === null) {
        res.send('Server Not Running')
    }else {
        res.send(JSON.stringify(psX, null, 4))
    }
})


function startApp(res) {
    if (psX !== null) {
        console.log("Applicatin nkp Already Started");
        if (res !== null){
            return res.send("PASS");
        }
    }
   
    psX = childProcess.spawn(path.join(process.cwd(), 'nkp/nkp.app'), {cwd: 'nkp'});

    console.log("Started Application nkp");
    // listen for errors as they may prevent the exit event from firing
    psX.on('error', function (err) {
    
        console.error(err);
    });
    
    psX.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    psX.stderr.on('data', (data) => {
        console.log(data.toString());
    });
    
    
    // execute the callback once the process has finished running
    psX.on('exit', function (code, signal) {
        if (invoked) return;
        invoked = false;
        console.warn("App Exited without been invoked, Code: " + code);
        console.error('ERROR!!!!! PLEASE CHECK YOUR CONFIG!!!')
        // return startApp(null)
    });
    if (res != null) {
        res.send("OK")
    }
    
}

function stopApp(res) {
     if (psX === null) {
        console.log("Application nkp not Running");
        return res.send("PASS");
    }
    invoked = true;
    psX.kill();
    
    psX = null;
    console.log("Stopped Application nkp");
    res.send("OK")

}

function restartApp(res) {
    console.log("Restarting Application nkp");

    if (psX !== null) {
         invoked = true;
         psX.kill();
         psX = null;
    }
    startApp(res)
    console.log("Restarted Application nkp");
}

module.exports = app;
