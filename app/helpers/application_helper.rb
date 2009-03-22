# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def navlinks
    "Admin links: " +
    %w(gigs artists venues ticket_sellers).collect { |v|
      link_to_unless_current v, send("admin_#{v}_path")
    }.join(' | ')
  end
  
  def play_track(url)
    link_to('', "javascript:player.sendEvent('LOAD', '#{url}'); player.sendEvent('PLAY')", :class => 'playing') unless url.blank?
  end
  
end
