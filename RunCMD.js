#!/usr/bin/env -S node  --no-warnings
const BSCMDEnviroment = require("./CMDEnviroment")

const cmd = new BSCMDEnviroment();
cmd.cmdRootPermissions = [cmd.perrmissionsKeys.default, cmd.perrmissionsKeys.script]
cmd.Start()