ActionController::Routing::Routes.draw do |map|
  
  map.namespace :admin  do |admin|
    admin.resources :offerings
    admin.resources :ticket_sellers
    admin.resources :artists
    admin.resources :gigs
    admin.resources :venues
    admin.resources :addresses
  end
  
  # Authlogic
  map.resource :account, :controller => "users"
  map.resources :users
  map.resource :user_session  
  
  map.resources :offerings, :ticket_sellers, :artists, :venues, :addresses
  map.resources :gigs, :collection => { :redirect => :get } 

  map.root :controller => "gigs", :action => 'redirect'

end
