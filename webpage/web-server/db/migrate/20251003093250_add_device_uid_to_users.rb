class AddDeviceUidToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :device_uid, :string
    add_index :users, :device_uid
  end
end
