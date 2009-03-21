class AddTrackToArtist < ActiveRecord::Migration
  def self.up
    add_column :artists, :track, :string
  end

  def self.down
    remove_column :artists, :track
  end
end
