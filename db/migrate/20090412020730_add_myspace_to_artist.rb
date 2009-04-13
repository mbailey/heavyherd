class AddMyspaceToArtist < ActiveRecord::Migration
  def self.up
    add_column :artists, :myspace, :string
  end

  def self.down
    remove_column :artists, :myspace
  end
end
