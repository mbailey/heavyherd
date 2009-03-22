class Gig < ActiveRecord::Base
  belongs_to :artist
  belongs_to :venue
  
  default_scope :order => 'date'
  named_scope :future, :conditions => 'date > Now()'
  
  # alias _price price
  # def price
  #   # sprintf '%0.2f', _price
  #   @price + 10
  # end
end
