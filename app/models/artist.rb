class Artist < ActiveRecord::Base
  has_many :gigs
  validates_format_of :mp3, :with => /^http.*\.mp3$/i, :message => "Doesn't look like the URL for an MP3 to me."
end
