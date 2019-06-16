## Impaired Home Automation

Advanced Studio Project @ AIT

6201 Mohammed Tantawy - 6678 Davide Bragagnolo

### Brain-Computer Interface Control

in order to run the script, you must have

- A bluetooth equipped laptop
- The Neurosky Mindwave Mobile 2
- NodeJS > 10
- the entire IHA System compesed by:
    - The IHA Robot + INS active [Details](https://github.com/imphomeauto/robot-wheelchair)
    - The IHA IPS active [Details](https://github.com/imphomeauto/indoor-pos-system)
    - The Smart Lights System active [Details](https://github.com/imphomeauto/smart_lights_esp8266_mcp23017)

install dependencies `npm install`

start the realtime `node local.js`

open the webgui to read the brain waves `http://<ip_of_your_raspberry>:9000`

### Command Details

The System will send a GOTO signal to the robot depending on the type of signal received, the 3 signal mapped are:

- attention > 80% over a short period of time -> go to toilet
- meditation > 80% over a short period of time -> go to bedroom
- blink > 5 times over a short period of time -> go to kitchen

The script will avoid double calls to the system.
