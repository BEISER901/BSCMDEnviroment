
# BSCMDEnviroment

"BSCMDEnviroment" - Командная среда, для работы с "bscript", предназначена для запуска скриптов написанных на "bscript" и отдельных команд, которая умеет интерпритировать ввод и вывод для разных сред таких например как терминал.  
## Установка
```
# npm
npm i bscmdenviroment

# yarn
yarn bscmdenviroment
```

## Использование
#### ./Test.js
```nodejs
#!/usr/bin/env -S node  --no-warnings
const BSCMDEnviroment = require("bscmdenviroment").BSCMDEnviroment

const cmd = new BSCMDEnviroment();
cmd.cmdRootPermissions = [cmd.perrmissionsKeys.default, cmd.perrmissionsKeys.script]
cmd.Start()
```
#### ./script.bs
```bash
$(test)={`Hello world!`}
$(array)={
    str `Hello world! 1`
    str `Hello world! 2`
    str `Hello world! 3`
}
print ${$val test}
print ${$val array}
$(newFunc)=FUNC=>{
    print ${num 1}
    print ${num 2}
    print ${num 3}
    print ${str ${$arg 0}}
}
print ${`exit`}
```

#### Консоль
```bash
 <help>? Test
 Command by name "Test" not found!
 <help>? ./script.bs
Hello world!
[ARRAY(3){Hello world! 1,Hello world! 2,Hello world! 3}]
exit
 <help>? ./script.bs;run ${$val newFunc}
Hello world!
[ARRAY(3){Hello world! 1,Hello world! 2,Hello world! 3}]
exit
1
2
3
[RAW $$(scope:path:0:7)]
 <help>? ./script.bs;run ${$val newFunc} ${`is arg 1!`}
 Hello world!
[ARRAY(3){Hello world! 1,Hello world! 2,Hello world! 3}]
exit
1
2
3
is arg 1!
 <help?> print ${str 123}
123
```
