class CreateDataPoints < ActiveRecord::Migration[8.0]
  def change
    create_table :data_points do |t|
      t.float :temperature
      t.float :humidity
      t.float :rainfall
      t.float :ph_value
      t.float :nitrogen
      t.float :phosphorus
      t.float :potassium
      t.float :soil_moisture
      t.references :farm, null: false, foreign_key: true

      t.timestamps
    end
  end
end
