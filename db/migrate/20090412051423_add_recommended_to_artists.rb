class AddRecommendedToArtists < ActiveRecord::Migration
  def self.up
    add_column :artists, :recommended, :boolean
  end

  def self.down
    remove_column :artists, :recommended
  end
end
