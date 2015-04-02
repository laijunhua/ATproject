var Login = function () {
    
    return {
        //main function to initiate the module
        init: function () {
            
           $('.login-form').validate({
                errorElement: 'label', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    account: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    remember: {
                        required: false
                    }
                },

                messages: {
                    account: {
                        required: "邮箱地址不能为空。",
                        email: "邮箱格式不正确。"
                    },
                    password: {
                        required: "密码不能为空。"
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit                       
                    login_show_error('邮箱帐号或密码有误。');
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.control-group').addClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label.closest('.control-group').removeClass('error');
                    label.remove();
                },

                errorPlacement: function (error, element) {
                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
                },

                submitHandler: function (form) {
                    $.ajax({
						url: '/login',
						type: 'POST',
						dataType: 'json',
						data: $('.login-form').serialize()
					})
					.done(login_done)
					.fail(login_fail);
                }
            });

            $('.login-form input').keypress(function (e) {
                if (e.which == 13) {
                    $('.login-form').submit();
                    return false;
                }
            });

            $('.forget-form').validate({
                errorElement: 'label', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    account: {
                        required: true,
                        email: true
                    }
                },

                messages: {
                    account: {
                        required: "邮箱地址不能为空。",
                        email: "邮箱格式不正确。"
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   

                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.control-group').addClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label.closest('.control-group').removeClass('error');
                    label.remove();
                },

                errorPlacement: function (error, element) {
                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
                },

                submitHandler: function (form) {
                    $('#submit-btn').text('正在发送').attr('disabled',true);
					$.ajax({
						url: '/forget',
						type: 'POST',
						dataType: 'json',
						data: $('.forget-form').serialize(),
					})
					.done(forget_done)
					.fail(forget_fail);
                }
            });

            $('.forget-form input').keypress(function (e) {
                if (e.which == 13) {
                    $('.forget-form').submit();
                    return false;
                }
            });

            jQuery('#forget-password').click(function () {
                jQuery('.login-form').hide();
                jQuery('.forget-form').show();
            });

            jQuery('#back-btn').click(function () {
                jQuery('.login-form').show();
                jQuery('.forget-form').hide();
            });

            $('.register-form').validate({
                errorElement: 'label', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    account: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        rangelength: [8,32]
                    },
                    rpassword: {
                        required: true,
                        equalTo: "#register_password"
                    },
                    trueName: {
                        required: true
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    
                    account: {
                        required: "邮箱地址不能为空。",
                        email: "邮箱格式不正确。"
                    },
                    password: {
                        required: "密码不能为空。",
                        rangelength: "密码长度应为8至32位。"
                    },
                    rpassword: {
                        required: "密码不能为空。",
                        equalTo: "两次输入的密码不相同。"
                    },
                    trueName: {
                        required: "真实姓名不能为空"
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   

                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.control-group').addClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label.closest('.control-group').removeClass('error');
                    label.remove();
                },

                errorPlacement: function (error, element) {
                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
                },

                submitHandler: function (form) {
					$.ajax({
						url: '/register',
						type: 'POST',
						dataType: 'json',
						data: $('.register-form').serialize(),
					})
					.done(register_done)
					.fail(register_fail);
                }
            });

			// TNC check
			$('#register-tnc').change(function () {
                $('#register-submit-btn').attr("disabled", !this.checked);
            });


            jQuery('#register-btn').click(function () {
                jQuery('.login-form').hide();
                jQuery('.register-form').show();
            });

            jQuery('#register-back-btn').click(function () {
                jQuery('.login-form').show();
                jQuery('.register-form').hide();
            });
        }

    };

}();


function login_done(response) {
	if (response.length === 0) {
		window.location.href = '/';
	}
	else {
		if (response.length > 0)
			login_show_error(response[0].error);
	}
}
function login_fail() {
	login_show_error('网络访问出现错误。');
}
function login_show_error(text) {
	$('.login-form .alert-error').show();
	$('.login-form .alert-error .alert-text').text(text);
}



function forget_done(response) {
	if (response.length === 0) {
        $('#submit-btn').text('已发送');
	} else {
		forget_fail();
	}
}
function forget_fail() {
    $('#submit-btn').text('无法发送');
	$('.forget-form .alert-error').show();
	$('.forget-form .alert-error .alert-text').text('网络访问出现错误。');
}



function register_done(response) {
	   if (response.length === 0) {
        window.location.href = '/';
    }
    else {
        if (response.length > 0)
            register_show_error(response[0].error);
    }
}
function register_fail() {
	register_show_error('网络访问出现错误。');
}
function register_show_error(text) {
	$('.register-form .alert-error').show();
	$('.register-form .alert-error .alert-text').text(text);
}