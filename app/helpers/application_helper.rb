# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def navlinks
    %w(gigs artists venues ticket_sellers).collect { |v|
      link_to_unless_current v, send("#{v}_path")
    }.join(' ')
  end
end
