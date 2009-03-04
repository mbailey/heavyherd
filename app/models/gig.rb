class Gig < ActiveRecord::Base
  belongs_to :artist
  belongs_to :venue
  
  # alias _price price
  # def price
  #   # sprintf '%0.2f', _price
  #   @price + 10
  # end
end
