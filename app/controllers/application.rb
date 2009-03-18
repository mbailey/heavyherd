# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  
  before_filter :authenticate
  

  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  protect_from_forgery # :secret => '5060c6d8c3a81659cdff4180a41d6474'
  
  # See ActionController::Base for details 
  # Uncomment this to filter the contents of submitted sensitive data parameters
  # from your application log (in this case, all fields with names like "password"). 
  # filter_parameter_logging :password
  
  private
    def authenticate
      # if XENIUM_ADMIN_PASSWORD.empty?
      #   render :text => "Password is not set.\nEdit #{PASSWORD_FILE} and restart app"
      # else
        authenticate_or_request_with_http_basic do |username, password|
          username == 'heavy' && password == 'herd'
        end
      # end
    end
end
