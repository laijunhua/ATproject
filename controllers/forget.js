/*
Controller for register
*/

exports.install = function(framework) {
    framework.route('/forget', upload, ['xhr', 'post']);
};

function upload() {

    var self = this;

    var post = Builders.prepare('forget-post', self.post);
    var validation = self.validate('forget-post', post);
    validation.resource('default', 'forget_');

    if (validation.hasError()) {
        return self.json(validation);
    }

    var User = MODEL('User').User;
    User.findByAccount(post['account'], function(user) {

        if (user !== null) {
            var model = {};//TODO:
            controller.mail(post['account'], RESOURCE('forget_email_title'), '~mail-forget', model, function(err) {
                if (err) 
                    self.throw500();
                else 
                    self.json(validation);
            });
        } else {
            self.json(validation);
        }
    });
}

// Framework schema
Builders.schema('forget-post', { account: 'string'}, function (name) {

    switch (name) {
        case 'account':
            return "";
    }

});

builders.validation('forget-post', ['account'], function(name, value) {

    switch (name) {
        case 'account':
            return (value || "").isEmail();
    }

});