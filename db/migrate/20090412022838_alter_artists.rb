class AlterArtists < ActiveRecord::Migration
  def self.up
    change_column :artists, :discog_detail, :text
  end

  def self.down
    change_column :artists, :discog_detail, :string
  end
end
