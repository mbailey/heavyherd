class Gig < ActiveRecord::Base
  belongs_to :artist
  belongs_to :venue
  
  default_scope :order => 'date'
  named_scope :future, :conditions => 'date > Now()'
  
  # Not sure we want to make a habit of this just to simplify views!
  def venue_name
    venue.name if venue
  end
  
  # alias _price price
  # def price
  #   # sprintf '%0.2f', _price
  #   @price + 10
  # end
end
