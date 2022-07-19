const fs = require('fs')
const superagent = require('superagent')
const { exec } = require('child_process')
const { validationResult } = require('express-validator');


exports.fetchDomains = (req, res) => {
    if (!fs.existsSync('./nkp/config/ssl.json')) {
        console.error('SSl files not found, please rerun config')
         return res.json({
				status: "Error",
				error: "Failed to Find SSL Files",
				information: null,
				message: 'Failed to Find SSL Files'
			})
    }
    
    const sslFileObj = JSON.parse(fs.readFileSync('./nkp/config/ssl.json'))
    const domainNameList = []

    sslFileObj.forEach(sslInfo => domainNameList.push(sslInfo.domain))

    const domainInfo = {
        ip: process.env.HOST_IP,
        domains: domainNameList,
    }
    return res.json({
        status: "Success",
        error: null,
        code: 0,
        message: 'OK',
        info: domainInfo,
    })
}


exports.addDomain = (req, res) => {
    const vResult = validationResult(req);
    const hasErrors = !vResult.isEmpty();
    if (hasErrors) {
            return res.status(402).json(vResult.errors);
    }
    const domainName = req.body.domain

    // if (!isValidDomain(domainName)) {
    //     return res.json({
	// 			status: "Error",
	// 			error: "Domain Name is Invalid",
	// 			code: -1,
	// 			message: 'Domain Name is Invalid'
	// 		})
    // }

    let sslFileObj = JSON.parse(fs.readFileSync('./nkp/config/ssl.json'))
    for (var sslVar of sslFileObj) {
        if (domainName === sslVar.domain) {
            console.error('Domain already exists')
            return res.json({
                status: "Error",
                error: 'Invalid Domain',
                code: 1,
                message: "Domain Does exist already, please check domain name...",
            })
        }
    }
    

    const domainData = {
        domain: domainName,
        cert: `/etc/letsencrypt/live/${domainName}/cert.pem`,
        key:  `/etc/letsencrypt/live/${domainName}/privkey.pem`,
    }

    const bashExec = exec(`bash scripts/setup-ssl.sh ${domainName}`, function(err, stdout, stderr) {
      if (err) {
          console.error("Early Failure for domain ")
        // should have err.code here?  
      }
    });
    bashExec.on('exit', function (code) {
        console.log("Code is " + code)

        if (code === 0) {

            // We save domain data here
            sslFileObj.push(domainData)
            fs.writeFileSync('./nkp/config/ssl.json', JSON.stringify(sslFileObj, '', 4))
            return res.json({
                status: "Success",
                error: null,
                code: 0,
                message: `Successfully changed Domain ${domainName}, Please Restart nkp to effect changes`,
                info: domainName,
            })

        }else {
            return res.json({
				status: "Error",
				error: "Failed To Change Domain SSL Capture Failed",
				code: code,
				needRestart: false,
				message: `Failed To Change Domain SSL Capture Failed ${domainName}.\nAre you sure A record of domain is pointed to ${process.env.HOST_IP}`
			})
        }
    });
}


exports.deleteDomain = (req, res) => {
    const vResult = validationResult(req);
    const hasErrors = !vResult.isEmpty();
    if (hasErrors) {
            return res.status(402).json(vResult.errors);
    }
    const domainName = req.body.domain


    let sslFileObj = JSON.parse(fs.readFileSync('./nkp/config/ssl.json'))
    if (!domainName in sslFileObj) {
        console.error('Domain does not exists')
        return res.json({
            status: "Error",
            error: 'Invalid Domain',
            code: 1,
            message: "Domain Does not exist, please check domain name...",
        })
    } else {
        sslFileObj = sslFileObj.filter(sslInfo => sslInfo.domain !== domainName)

        fs.writeFileSync('./nkp/config/ssl.json', JSON.stringify(sslFileObj, '', 4))
        return res.json({
            status: "Success",
            error: null,
            code: 0,
            message: `Successfully deleted Domain ${domainName}, Please Restart nkp to effect changes`,
            info: domainName,
        })
    }
}

