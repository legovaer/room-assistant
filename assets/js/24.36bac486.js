(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{475:function(t,e,a){"use strict";a.r(e);var s=a(59),n=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"grid-eye"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#grid-eye"}},[t._v("#")]),t._v(" Grid-EYE")]),t._v(" "),a("p",[a("strong",[t._v("Integration Key:")]),t._v(" "),a("code",[t._v("gridEye")])]),t._v(" "),a("p",[t._v("The Grid-EYE sensor by Panasonic is a thermopile sensor that can be used to measure a 64x64 matrix of temperatures in front of its lense. This data can be used to detect human presence in the room, even if the person is stationary. This is done by analyzing the temperature readings for localized peaks, i.e. certain spots have a notably higher temperature than the rest. SparkFun sells a "),a("a",{attrs:{href:"https://www.sparkfun.com/products/14607",target:"_blank",rel:"noopener noreferrer"}},[t._v("version of the sensor"),a("OutboundLink")],1),t._v(" that can be easily connected to Linux boards and will also work with this component.")]),t._v(" "),a("p",[t._v("This integration will provide a sensor that contains a count of people in the room. It also includes their coordinates (relative to the sensor view) in the sensor attributes.")]),t._v(" "),a("h2",{attrs:{id:"requirements"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#requirements"}},[t._v("#")]),t._v(" Requirements")]),t._v(" "),a("p",[t._v("The sensor needs to be connected to the I"),a("sup",[t._v("2")]),t._v("C pins on your machine.")]),t._v(" "),a("h3",{attrs:{id:"running-with-nodejs"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#running-with-nodejs"}},[t._v("#")]),t._v(" Running with NodeJS")]),t._v(" "),a("p",[t._v("To enable heatmap generation you may be required to install some "),a("a",{attrs:{href:"https://github.com/Automattic/node-canvas#compiling",target:"_blank",rel:"noopener noreferrer"}},[t._v("additional system packages"),a("OutboundLink")],1),t._v(" for compilation:")]),t._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apt-get")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" i --global --unsafe-perm room-assistant\n")])])]),a("p",[t._v("For Raspberry Pi devices the I"),a("sup",[t._v("2")]),t._v("C interface also needs to be enabled using "),a("code",[t._v("sudo raspi-config")]),t._v(" and then enabling the I"),a("sup",[t._v("2")]),t._v("C option under Advanced Options.")]),t._v(" "),a("h3",{attrs:{id:"running-with-docker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#running-with-docker"}},[t._v("#")]),t._v(" Running with Docker")]),t._v(" "),a("p",[t._v("Your i2c device needs to be enabled on the host and mapped into the container as a device like shown below.")]),t._v(" "),a("details",{staticClass:"custom-block details"},[a("summary",[t._v("Example docker-compose.yml")]),t._v(" "),a("div",{staticClass:"language-yaml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("version")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'3'")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("services")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("room-assistant")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("image")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" mkerix/room"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("assistant\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("network_mode")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" host\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("volumes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" /var/run/dbus"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("/var/run/dbus\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("devices")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" /dev/i2c"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("environment")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("NODE_CONFIG")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")]),a("span",{pre:!0,attrs:{class:"token scalar string"}},[t._v('\n        {\n          "global": {\n            "instanceName": "changeme",\n            "integrations": ["gridEye"]\n          }\n        }')]),t._v("\n")])])])]),t._v(" "),a("h3",{attrs:{id:"running-with-home-assistant-os"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#running-with-home-assistant-os"}},[t._v("#")]),t._v(" Running with Home Assistant OS")]),t._v(" "),a("p",[t._v("You will need to enable the i2c interface by following the "),a("a",{attrs:{href:"https://www.home-assistant.io/hassio/enable_i2c/",target:"_blank",rel:"noopener noreferrer"}},[t._v("official Home Assistant OS guide"),a("OutboundLink")],1),t._v(". The "),a("code",[t._v("config.txt")]),t._v(" file that you create should also contain an additional option, leading to the following contents:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("dtparam=i2c1=on\ndtparam=i2c_arm=on\ndtparam=i2c_baudrate=10000\n")])])]),a("p",[t._v("Reboot after you imported your config in the supervisor.")]),t._v(" "),a("h2",{attrs:{id:"sensor-placement"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sensor-placement"}},[t._v("#")]),t._v(" Sensor placement")]),t._v(" "),a("p",[t._v("When placing your sensor you need to consider a few factors to get reliable results:")]),t._v(" "),a("ul",[a("li",[t._v("Don't face the sensor towards a source of heat that is less than 5 meters away, for example radiators or windows.")]),t._v(" "),a("li",[t._v("Make sure the sensor has a clear view of all areas that you want to track.")]),t._v(" "),a("li",[t._v("Consider the range of the sensor, the further away people are the harder it will be to reliably detect them.")]),t._v(" "),a("li",[t._v("Consider the field of view as stated in the datasheet.")])]),t._v(" "),a("h2",{attrs:{id:"settings"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#settings"}},[t._v("#")]),t._v(" Settings")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Name")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Default")]),t._v(" "),a("th",[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("busNumber")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td",[a("code",[t._v("1")])]),t._v(" "),a("td",[t._v("I"),a("sup",[t._v("2")]),t._v("C bus number of your machine that the sensor is connected to.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("address")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td",[a("code",[t._v("0x69")])]),t._v(" "),a("td",[t._v("I"),a("sup",[t._v("2")]),t._v("C address of the D6T sensor that you want to use.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("deltaThreshold")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td",[a("code",[t._v("2")])]),t._v(" "),a("td",[t._v("Minimum temperature difference between average and single temperature pixel in °C for it to be considered as human presence. Increase if you are seeing false positives, decrease if you are seeing false negatives.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("heatmap")])]),t._v(" "),a("td",[a("a",{attrs:{href:"#heatmap"}},[t._v("Heatmap")])]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("A number of options for configuring the heatmap output.")])])])]),t._v(" "),a("h3",{attrs:{id:"heatmap"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#heatmap"}},[t._v("#")]),t._v(" Heatmap")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Name")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Default")]),t._v(" "),a("th",[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("minTemperature")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td",[a("code",[t._v("16")])]),t._v(" "),a("td",[t._v("Temperature that will be considered the lower bound for the color scale in °C.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("maxTemperature")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td",[a("code",[t._v("30")])]),t._v(" "),a("td",[t._v("Temperature that will be considered the upper bound for the color scale in °C.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("rotation")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td",[a("code",[t._v("0")])]),t._v(" "),a("td",[t._v("The amount of degrees that the heatmap output image should be rotated. Only "),a("code",[t._v("0")]),t._v(", "),a("code",[t._v("90")]),t._v(", "),a("code",[t._v("180")]),t._v(" or "),a("code",[t._v("270")]),t._v(" are supported as values.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("drawTemperatures")])]),t._v(" "),a("td",[t._v("Boolean")]),t._v(" "),a("td",[a("code",[t._v("true")])]),t._v(" "),a("td",[t._v("Whether the actual temperature values should be drawn on the heatmap or not.")])])])]),t._v(" "),a("details",{staticClass:"custom-block details"},[a("summary",[t._v("Example Config")]),t._v(" "),a("div",{staticClass:"language-yaml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("global")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("integrations")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" gridEye\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("gridEye")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("deltaThreshold")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("heatmap")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("minTemperature")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("16")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("maxTemperature")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("rotation")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("180")]),t._v("\n")])])])])])}),[],!1,null,null,null);e.default=n.exports}}]);