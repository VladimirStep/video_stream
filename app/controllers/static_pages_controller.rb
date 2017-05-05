class StaticPagesController < ApplicationController
  def index
  end

  def record
  end

  def upload
    uploaded_io = params[:video_blob]
    file_name = params[:filename]
    File.open(Rails.root.join('public', 'uploads', file_name + '.webm'), 'wb') do |file|
      file.write(uploaded_io.read)
    end
  end
end
