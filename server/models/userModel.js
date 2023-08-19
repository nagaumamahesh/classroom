const mongoose = require('mongoose');
const crypto = require('crypto'); 

//User data
/**
 * name
 * email
 * hashed password
 * educator -> toggle it
 * account creating date
 * account updated date
 */
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        trim : true,
        required : 'Name is Required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },    
    hashed_password : {
        type: String,
        required : 'Password is required'
    },
    salt : String,
    updated : Date,
    created : {
        type : Date,
        default : Date.now
    },
    educator:{
        type : Boolean,
        default : false
    },
})


// Virtual method makes the field does not actually get stored to the database.Instead, virtuals are calculated dynamically whenever the field is accessed.
UserSchema.virtual('password')
    .set(function (password) {
        this._password = password; //save the password
        this.salt = this.makeSalt(); //uses current time and random number to generate salt
        this.hashed_password = this.encryptPassword(password); // uses the salt with sha1 encoding and updates the password result is hashed_password
    })
    .get(function () {
        return this._password;
    });

// Validation for hashed_password
UserSchema.path('hashed_password').validate(function () {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.');
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required');
    }
}, null);

/**
 * Helper Methods
 * 
 */
UserSchema.methods= {

    authenticate: function (plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword : function(password) {
        if(!password) return ''
        try{
            return crypto
                        .createHmac('sha1' , this.salt)
                        .update(password)
                        .digest('hex')
        }catch(err){
            return ''
        }
    },

    makeSalt : function(){
        return Math.round((new Date().valueOf()* Math.random())) + ""
    }
}

module.exports = mongoose.model('User', UserSchema);