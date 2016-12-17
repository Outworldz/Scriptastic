(function(){
    // This file depends on the runtime extensions, which should probably be moved into this namespace rather than made global

// Raphael Extensions (making life easier on our script templates)

// Provide the arc of a circle, given the radius and the angles to start and stop at
Raphael.fn.arcslice = function(radius, fromangle, toangle){
       var x1 = Math.cos(deg2rad(fromangle)) * radius,
           y1 = Math.sin(deg2rad(fromangle)) * radius,
           x2 = Math.cos(deg2rad(toangle)) * radius,
           y2 = Math.sin(deg2rad(toangle)) * radius;
        var arc = this.path();
        arc.moveTo(x1, y1).arcTo(radius, radius, 0, 1, x2,y2, rad2deg(toangle - fromangle));
        return arc;
};

Raphael.fn.regularPolygon = function(cx,cy,radius, sides, pointsOnly){
    var angle = 0;
    var theta = Math.PI * 2 / sides;
    var x = Math.cos(0) * radius + cx;
    var y = Math.sin(0) * radius + cy;
    if (pointsOnly){
        var points = [[x,y]];
    }else{
        var path = this.path();
        path.moveTo(x,y);
    }
    for (var i = 1; i < sides; i++){
        x = Math.cos(theta * i) * radius + cx;
        y = Math.sin(theta * i) * radius + cy;
        if (pointsOnly){
            points.push([x,y]);
        }else{
            path.lineTo(x,y);
        }
    }
    if (pointsOnly){
        return points;
    }else{
        path.andClose();
        return path;
    }
};

Raphael.fn.imageWithNaturalHeight = function(url){
    var img = this.image(url, 0, 0, 0, 0);
    function getWidthAndHeight() {
        img.attr({width: this.width, height: this.height});
        return true;
    }
    function loadFailure() {
        console.log("'" + this.name + "' failed to load.");
        return true;
    }
    var myImage = new Image();
    myImage.name = url;
    myImage.onload = getWidthAndHeight;
    myImage.onerror = loadFailure;
    myImage.src = "";
    return img;
};



// expose these globally so the Block/Label methods can find them
window.choice_lists = {
    keys: 'abcdefghijklmnopqrstuvwxyz0123456789*+-./'
        .split('').concat(['up', 'down', 'left', 'right',
        'backspace', 'tab', 'return', 'shift', 'ctrl', 'alt',
        'pause', 'capslock', 'esc', 'space', 'pageup', 'pagedown',
        'end', 'home', 'insert', 'del', 'numlock', 'scroll', 'meta']),
    linecap: ['round', 'butt', 'square'],
    linejoin: ['round', 'bevel', 'mitre'],
    easing: ['>', '<', '<>', 'backIn', 'backOut', 'bounce', 'elastic'],
    fontweight: ['normal', 'bold', 'inherit']
};


var menus = {
    events: menu('Events', [
        {
            label: 'When script is reset',
            trigger: true,
            script: ' state_entry(){ // this happens when the script is reset \n[[next]]\n }\n'
         },{
            label: 'When object is rezzed',
            trigger: true,
            script: ' on_rez(integer param){ // this object has been rezzed\n[[next]]\n }\n'
         },{
            label: 'When attached',
            trigger: true,
            script: ' attach(key id){ // object is attached\n[[next]]\n }\n'
         },{
            label: 'When timer expires',
            trigger: true,
            script: ' timer(){ // timer triggered by llSetTimerEvent()\n[[next]]\n }\n'
         },{
            label: 'When Link Message [string:SomeText] received',
            trigger: true,
            script: ' link_message(integer sender_num, integer num, string str, key id ) { // message sent by llMessage_linked arrived\n  if (str == "{{1}}"){\n[[next]]\n  }\n }\n'
        },{
            label: 'When chat message [string:Yay] received',
            trigger: true,
            script: ' listen(integer chan, string name, key id, string msg) {  // chat message heard\n  if (msg == "{{1}}") {\n[[next]]\n  }\n }\n'
        },{
            label: 'When object clicked',
            trigger: true,
            script: ' touch_start(integer total_number){ \n[[next]]\n }\n'
         },{
              label: 'Accept money',
              trigger: true,
              script: ' money(key id, integer amount) {     // Some money has been received \n[[next]]\n }\n'
         },{
            label: 'When object collides',
            trigger: true,
            script: ' collision(integer num_detected){ \n[[next]]\n }\n'
         },{
            label: 'When land collides',
            trigger: true,
            script: ' land_collision(vector pos){ // triggered in the root when physical object or attached avatar is colliding with land\n[[next]]\n }\n'
         },{
            label: 'When something is sensed',
            trigger: true,
            script: ' sensor(integer num_detected){\n[[next]]\n }\n'
         },{
            label: 'When something is not sensed',
            trigger: true,
            script: ' no_sensor(){\n[[next]]\n }\n'
         },{
           label: 'Object contents changed',
            trigger: true,
            script: ' changed(integer what) {\n  if(what & CHANGED_INVENTORY) {\n[[next]]\n  }\n }\n'
        },{
           label: 'Object changed regions',
            trigger: true,
            script: ' changed(integer what) {\n  if(what & CHANGED_REGION) {\n[[next]]\n  }\n }\n'
        },{
           label: 'Avatar teleported',
            trigger: true,
            script: ' changed(integer what) {\n  if(what & CHANGED_TELEPORT) {\n[[next]]\n  }\n }\n'
        },{
           label: 'Object sat on ',
            trigger: true,
            script: ' changed(integer what) {\n  if(what & CHANGED_LINK) {\n   key av = llAvatarOnSitTarget();\n   if (av) { // evaluated as true if key is valid and not NULL_KEY\n[[next]]\n   }\n  }\n }\n'
        },{
           label: 'Object contents changed',
            trigger: true,
            script: ' changed(integer what) {\n  if(what & CHANGED_INVENTORY) {\n   // Object contents changed\n[[next]]\n  }\n }\n'
        }

    ], false),


    sensing: menu('Sensing', [
       {
           label: 'Sense Avatar [string:AvatarName] once',
            script: '  llSensor( "{{1}}", "", AGENT_BY_LEGACY_NAME, 96.0, PI) ; // Sense Avatar {{1}} once'
        },{
           label: 'Sense Object [string:ObjectName] once',
            script: '  llSensor( "{{1}}", "", PASSIVE|ACTIVE, 96.0, PI) ; // Sense Object {{1}} once'
        },{
           label: 'Sense any Avatar every [number:10] seconds',
            script: '  llSensorRepeat( "", "", AGENT, 96.0, PI, {{1}}); // Sense any Avatar every {{1}} seconds\n'
        },{
           label: 'Sense Object [string:ObjectName] every [number:2] seconds',
            script: '  llSensorRepeat( "{{1}}", "", PASSIVE|ACTIVE, 96.0, PI, {{2}}); // Sense Object {[1}} every {{2}} seconds at a range of 96 meters\n'
        },{
            label: 'Remove Sensor',
            script: '  llSensorRemove(); // remove sensor\n'
        },{
           label: 'Listen for chat from anyone',
            script: '  llListen(0, "", "", ""); // Listen for chat from anyone\n'
        },{
           label: 'Listen for chat from owner',
            script: '  llListen(0, "", llGetOwner(), "");// Listen for chat from owner\n'
        },{
           label: 'Listen for chat from object on channel [number:1]',
            script: '  llListen({{1}}, "", "", ""); // Listen for chat from object on channel {{1}}\n'
        }

    ]),

       control: menu('Flow-Control', [
       {
           label: 'Repeat [number:10] times',
            containers: 1,
            script: '  integer a;\n  do {\n  [[1]]  }  while(++a < {{1}});\n'
        },{
           label: 'if [string:Expression1] ',
            containers: 2,
            script: '  if({{1}}) {\n   [[1]]\n  } else {\n   [[2]]  } // end if\n'
        },{
            label: 'Reset the script',
            slot: false,
            script: '  llResetScript();  // reset this script\n'
        },{
            label: 'Pause [number:1] seconds     ',
            script: '  llSleep({{1}});\n'
        },{
            label: 'Return',
            slot: false,
            script: '  return();\n'
        }


    ]),





    shapes: menu('Looks', [
        {
            label: 'Add hover text [string:Hello Avatar!]',
            script: '  llSetText("{{1}}", <1.0,1.0,1.0>, 1.0); // add hover text\n'
        },{
              label: 'Apply texture [string: textureName]',
              script: '  llSetTexture("{{1}}", ALL_SIDES); // change texture'
        },{
            label: 'Turn red',
            script: '  llSetColor(<1.0, 0.0, 0.0>,ALL_SIDES); // turn red\n'
        },{
            label: 'Turn green',
            script: '  llSetColor(<0.0, 1.0, 0.0>,ALL_SIDES); // turn green\n'
        },{
            label: 'Turn blue',
            script: '  llSetColor(<0.0, 0.0, 1.0>,ALL_SIDES);// turn blue\n'
        },{
            label: 'Grow x2',
            script: '  llSetScale(<2.0, 2.0, 2.0>); // grow\n'
        },{
            label: 'Shrink x2',
            script: '  llSetScale(<0.5, 0.5, 0.5>); // shrink\n'
        },{
            label: 'Turn glow on',
            script: '  llSetPrimitiveParams([PRIM_GLOW, ALL_SIDES, .6]); // glow off\n'
        },{
            label: 'Turn glow off',
            script: '  llSetPrimitiveParams([PRIM_GLOW, ALL_SIDES, 0]); // glow on\n'
        },{
            label: 'Make transparent',
            script: '  llSetAlpha(0.0,ALL_SIDES); // make invisible\n'
        },{
            label: 'Make opaque',
            script: '  llSetAlpha(1,ALL_SIDES); // make opaque\n'
       },{
            label: 'Slide Texture',
            script: '  llSetTextureAnim(ANIM_ON | SMOOTH | LOOP , ALL_SIDES, 1, 1, 1.0, 1.0, 1.0);// slides a texture smoothly and loops it when it gets to the end. \n'
        },{
            label: 'Rotate Texture constantly',
            script: '  llSetTextureAnim(ANIM_ON | SMOOTH | ROTATE | LOOP, ALL_SIDES,1,1,0, TWO_PI, 2*TWO_PI);// rotates a texture counter-clockwise at 2 revolutions per second. Change the last value to -2*TWO_PI to rotate clockwise. \n'
        },{
            label: 'Rotate Texture 1/4 turn',
            script: '  llRotateTexture(PI_BY_TWO, ALL_SIDES);//   objects\'s texture rotates a quarter of turn\n'
        },{
            label: 'Scale Texture',
            script: '  llSetTextureAnim(ANIM_ON | SMOOTH | SCALE | PING_PONG | LOOP, ALL_SIDES, 1, 1, 1.0, 3.0, 2.0); // scales a texture larger and smaller. '
        },{
            label: 'Disable Texture Animation',
            script: '  llSetTextureAnim(FALSE, ALL_SIDES, 0, 0, 0.0, 0.0, 1.0);//  turns off all texture animations \n'
        }

     ]),


    text: menu('Motion', [
        {
            label: 'Prim Animate [string:AnimationName]',
            script: '  llMessageLinked(LINK_SET,1,"{{1}}",""); // play animation named {{1}}\n'
        },{
            label: 'Make Physical',
            script: '  llSetStatus(STATUS_PHYSICS,TRUE); // object will fall\n  llSleep(0.1); // wait for a moment until it kicks in\n'
        },{
            label: 'Make Mon-Physical',
            script: '  llSetStatus(STATUS_PHYSICS,FALSE); // now just an ordinary prim\n'
        },{
              label: 'Anti-gravity [string: 1.05]',
              script: '  llSetBuoyancy({{1}}); // float upward - must also "Make Physical" for this to work\n'
        },{
              label: 'Fly up',
              script: '  llSetForce(<0,0,0x7FFFFFFF>, 0);  // fly  up fast! must also "Make Physical" for this to work\n'
        },{
            label: 'Move forward [number:1] meters',
            script: '  llSetPos(llGetPos()+<0,{{1}},0>); // move forward\n'
        },{
            label: 'Move back [number:1] meters',
            script: '  llSetPos(llGetPos()+<0,-{{1}},0>); // move back\n'
        },{
            label: 'Move right [number:1] meters',
            script: '  llSetPos(llGetPos()+<{{1}},0,0>); // move right\n'
        },{
            label: 'Move left [number:1] meters',
            script: '  llSetPos(llGetPos()+<-{{1}},0,0>); // move left\n'
        },{
            label: 'Move up [number:1] meters',
            script: '  llSetPos(llGetPos()+<0,0,{{1}}>); // move up\n'
        },{
            label: 'Move down [number:1] meters',
            script: '  llSetPos(llGetPos()+<0,0,-{{1}}>); // move down\n'
        },{
            label: 'Rotate[number:30] degrees vertically',
            script: '  llSetRot(llGetRot() * llEuler2Rot(<0,0,{{1}}>*DEG_TO_RAD));  // spins around the vertical axis \n'
        },{
            label: 'Rotate[number:30] degrees front',
            script: '  llSetRot(llGetRot() * llEuler2Rot(<0,{{1}},0>*DEG_TO_RAD));  // spins around the front axis \n'
        },{
            label: 'Rotate[number:30] degrees vertically',
            script: '  llSetRot(llGetRot() * llEuler2Rot(<{{1}},0,0,>*DEG_TO_RAD));  // spins around the side axis \n'
        },{
            label: 'Spin object [number:2] radians/sec',
            script: '  llTargetOmega(<0,0,1>,{{1},1);// spin object\n'
        },{
            label: 'Stop spinning object',
            script: '  llTargetOmega(<0,0,0>,0,0); // stop spinning\n'
        },{
            label: 'Rez Object [string:objectName]',
            script: '  llRezObject("{{1}}", llGetPos() + <0.0,0.0,0.0>, <0.0,0.0,0.0>, ZERO_ROTATION, 0); //  rezzes a copy of an object named {{1}} \n'
        },{
            label: 'Start Animation [string:animationName]',
            script: ' llStartAnimation("{{1}}") // animation must be in the object\n'
        },{
            label: 'Stop Animation [string:animationName]',
            script: '  llStopAnimation("{{1}}")// stops named animation \n'
        }

     ]),

    functions: menu('Chat', [
        {
            label: 'Send Script a Message [string:Message]',
            script: '  llMessageLinked(LINK_SET,0,"{{1}}",""); // send string {{1}} to link_message() in another script\n'
        },{
            label: 'Shout: [string:Hello World!] 100 meters',
            script: '  llSay(0,"{{1}}");// travels 100 meters\n'
        },{
            label: 'Say: [string:Hello World!] 20 meters',
            script: '  llSay(0,"{{1}}"); // travels 20 meters\n'
        },{
            label: 'Whisper: [string:Hello World!] 10 meters',
            script: '  llSay(0,"{{1}}");// travels 10 meters\n'
        }
     ]),

    functions: menu('Functions', [
        {
            label: 'Comment: [string:Enter a comment] ',
            script: '// {{1}} \n'
        },{
            label: 'LSL Code: [string:llResetScript();] ',
            script: '  {{1}} // User code\n'
        },{
            label: 'Die',
             slot: false,
            script: '  llDie(); // Program and primitive will disappear\n'
        },{
            label: 'Start a Timer for [number:10] seconds',
            script: '  llSetTimerEvent({{1}});// trigger a timer() event in {{1}} second\n'
        },{
           label: 'Load web page [string:http://www.outworldz.com]',
            script: ' llLoadURL(llDetectedKey(0), "Visit the website!", "{{1}}");\n'
        },{
            label: 'Play Sound named [string:SomeSoundName]',
            script: '  llPlaySound("{{1}}",1.0);// full volume = 1.0\n'
        },{
            label: 'Loop Sound named [string:SomeSoundName]',
            script: '  llLoopSound("{{1}}",1.0);// full volume = 1.0\n'
        },{
            label: 'Stop all Sounds',
            script: '  llStopSound();\n'
        },{
            label: 'float [string:Variable] = [number:1.0]',
            script: '  float {{1}} = {{2}}; // Declare a variable that hold the value {{2}}\n'
        },{
            label: 'integer [string:Variable] = [number:1]',
            script: '  integer {{1}} = {{2}}; // Declare a variable that hold the value {{2}}\n'
        },{
            label: 'vector [string:Variable] = [string:<1,2,3>]',
            script: '  vector {{1}} = {{2}}; // Declare a variable that hold the vector {{2}}\n'
        }

     ])
 };

})();