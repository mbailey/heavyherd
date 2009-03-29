# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def navlinks
    "Admin links: " +
    %w(gigs artists venues ticket_sellers).collect { |v|
      link_to_unless_current v, send("admin_#{v}_path")
    }.join(' | ')
  end
  
  def days_since(time)
    days = ((Time.now - time)/86400).ceil if time
    "#{days} day#{'s' unless days == 1} ago"
  end
  
  def play_track(url)
    link_to('', "javascript:player.sendEvent('LOAD', '#{url}'); player.sendEvent('PLAY')", :class => 'playing') unless url.blank?
  end
  
  def fmt_time(time)
    time.strftime("%I:%M %p").sub(/^0/,'')
  end
  
  def fmt_dollars(val)
    val && sprintf("$%0.2f",val)
  end
  
  def fmt_address(obj)
    <<-HERE
    #{[obj.address_1, obj.address_2].flatten.join("<br/>\n")}
    #{obj.city}<br/>
    #{obj.state}<br/>
    #{obj.postcode}
    HERE
  end
end
