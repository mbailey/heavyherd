class CreateArtists < ActiveRecord::Migration
  def self.up
    create_table :artists do |t|
      t.string :name
      t.string :country
      t.string :web
      t.string :mp3
      t.string :tor

      t.timestamps
    end
  end

  def self.down
    drop_table :artists
  end
end
