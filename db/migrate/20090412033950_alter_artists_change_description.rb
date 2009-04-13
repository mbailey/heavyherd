class AlterArtistsChangeDescription < ActiveRecord::Migration
  def self.up
    change_column :artists, :description, :text
  end

  def self.down
    change_column :artists, :description, :string
  end
end
