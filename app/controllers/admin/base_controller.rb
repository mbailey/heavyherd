class Admin::BaseController < ApplicationController
  before_filter :require_user
  
  # layout 'admin'
  
    
  # before_filter :require_user
  # before_filter :require_admin
  
end