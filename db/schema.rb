# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20090321124546) do

  create_table "addresses", :force => true do |t|
    t.string   "address_1"
    t.string   "address_2"
    t.string   "city"
    t.string   "state"
    t.string   "postcode"
    t.float    "lat"
    t.float    "lng"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "artists", :force => true do |t|
    t.string   "name"
    t.string   "country"
    t.string   "web"
    t.string   "mp3"
    t.string   "tor"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "cover_image"
    t.string   "track"
    t.string   "album"
    t.string   "description"
  end

  create_table "gigs", :force => true do |t|
    t.integer  "venue_id"
    t.integer  "artist_id"
    t.date     "date"
    t.float    "price"
    t.time     "door_open"
    t.boolean  "sold_out"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "offerings", :force => true do |t|
    t.integer  "ticket_seller_id"
    t.integer  "gig_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ticket_sellers", :force => true do |t|
    t.string   "name"
    t.integer  "address_id"
    t.string   "phone"
    t.string   "web"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                     :limit => 40
    t.string   "name",                      :limit => 100, :default => ""
    t.string   "email",                     :limit => 100
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",            :limit => 40
    t.datetime "remember_token_expires_at"
    t.string   "activation_code",           :limit => 40
    t.datetime "activated_at"
    t.string   "state",                                    :default => "passive"
    t.datetime "deleted_at"
  end

  add_index "users", ["login"], :name => "index_users_on_login", :unique => true

  create_table "venues", :force => true do |t|
    t.string   "name"
    t.integer  "address_id"
    t.string   "email"
    t.string   "web"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
