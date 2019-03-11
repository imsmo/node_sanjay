var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

	response: function (status, message, data) {
		return {
			status: status || 0,
			message: message || "Something is wrong!!",
			data: data || null
		};
    },
    
    validateObjectId: function (id) {

        if (ObjectId.isValid(id)) {
            var obj = new ObjectId(id);
            if (obj == id) {
                return true;
            }
        }
        return false;

    },

	issueToken: function (data) {
		return jwt.sign(data, config.apiSecret);
	},

	verifyApiToken: async function (token) {
		if (token) {
			us = await User
				.findOne({
					'tokens.token': token
				});

			if (us)
				return {
					status: true,
					user: us
				};
			else
				return {
					status: false
				};

		} else {
			return {
				status: false
			};
		}
	},

	validateEmail: function (email) {
		var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
		return re.test(email);
    },

	validateURL: function (url) {
		var re = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})");
		return re.test(url);
	},

	validateDate: function (date) {
        // Format YYYY-MM-DD
		var re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
		return re.test(date);
    },

	validateDateObject: function (date) {
		var date = new Date(date);
		if(date)
			return true;
		return false;
	},    

	uploadFile: function (file, types , folder) {

        if(!folder)
            folder = '/files';

		return new Promise((resolve, reject) => {

			console.log("UPLOAD THIS FILE", file);

			var re = /(?:\.([^.]+))?$/;
			var ext = re.exec(file.name)[1];

			if (ext == 'undefined') {
				console.log("FILE EXT UNDEFINED");
				return resolve(false);
			}

			if (types) {
				if (types.indexOf(ext.toLowerCase()) == -1) {
					console.log("FILE TYPE NOT ALLOWED", ext);
					return resolve(false);
				}
			}

			let name = folder + new Date().getTime() + Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1);
			let fileLocation = name + '.' + ext;

			var mime_type = mime.lookup(fileLocation);
			if(!mime_type)
			{
				console.log("Not a valid mime",fileLocation);
				return resolve(false);
			}
			console.log("MIME FOUND",mime_type);

			// Use the mv() method to place the file somewhere on your server
			file.mv('./public' + fileLocation, function (err) {

				if (err) {
					console.log("Error saving file on server");
					return resolve(false);
				}

				return resolve(config.live_url+fileLocation);

			});

		});
    },

	uploadFileBase64: function (file) {

        var folder = '/images';

		return new Promise((resolve, reject) => {

			var ext = 'jpeg';

			let name = folder + new Date().getTime() + Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1);
			let fileLocation = name + '.' + ext;

			buf = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""),'base64')
			console.log("BUF",fileLocation);

			fs.writeFile('./public'+fileLocation, buf, "binary", function(err) {
				if(err)
					 return reject(false);
					 
				return resolve(config.live_url+fileLocation);
					
			});
		});
    },

	sendNotificationFireBase: function (notifData, tokens, tdp) {

		return new Promise(async (resolve, reject) => {

			var fcm = new FCM(config.firebaseKey);

			var token = "";
			var type = "";

			for( const tok of tokens ){
				if( tok.access != 'web' ){
					token = tok.firebase_token;
					type = tok.access;
				}
			}

			if( type == "" || token == "" )
			{
				return reject({
					'error': 'Notifications not supported for platform : ' + type.toLowerCase()
				});
			}

			var message = {};

			if (type.toLowerCase() == "android") {
				//Android
				message = {
					to: token,
					data: notifData
				};
			} else if (type.toLowerCase() == "ios") {
				//IOS
				var iosData = {};
				iosData = notifData;
				iosData.body =notifData.message
				iosData.sound = "default";
				message = {
					to: token,
					notification: iosData,
					tickerText: notifData.title
				};
			} else {
				console.log("TYPE",type);
				console.log("TOKEN",token);
				return reject({
					'error': 'Notifications not supported for platform : ' + type.toLowerCase()
				});
			}

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("TYPE",type);
					console.log("TOKEN",token);
					console.log("ERR", err);
					reject(err);
				} else {
					console.log("Notification Sent Successfully", response);
					resolve("Notification Sent Successfully >> ",token);
				}
			});
		});

    },

	formateDateTime: function (date) {
		// 7/12/2018 12:25PM
		var dat = new Date(date);
		var mon = (dat.getMonth() + 1 > 9) ? dat.getMonth() + 1 : "0" + parseInt(dat.getMonth() + parseInt(1));


		var hours = dat.getHours() % 12;
		hours = (hours > 9) ? hours : "0" + hours;

		var minutes = dat.getMinutes();
		minutes = (minutes > 9) ? minutes : "0" + minutes;

		var ap = (dat.getHours() >= 12) ? "PM" : "AM";
		var day = (dat.getDate() > 9) ? dat.getDate() : "0" + dat.getDate();

		rez = day + "/" + mon + "/" + dat.getFullYear() + " " + hours + ":" + minutes + ap;

		return rez;
    },

	formatDate: function (date) {
		// 29 May 1992

		var dat = new Date(date);

		var mon = months[dat.getMonth()];

		var day = (dat.getDate() > 9) ? dat.getDate() : "0" + dat.getDate();

		rez = day + " " + mon + " " + dat.getFullYear();

		return rez;
    },
    
	randomNumber: async function (length) {
		return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
	},

	// timeago: function (timestamp) {
	// 	return timeagoInstance.format(timestamp);
	// },
	
	toCapitalize: function (str) {
        // Hello World How Are You.
		return _.startCase(_.toLower(str));
	}

}