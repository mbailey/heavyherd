class Admin::TicketSellersController < ApplicationController
  # GET /ticket_sellers
  # GET /ticket_sellers.xml
  def index
    @ticket_sellers = TicketSeller.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @ticket_sellers }
    end
  end

  # GET /ticket_sellers/1
  # GET /ticket_sellers/1.xml
  def show
    @ticket_seller = TicketSeller.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @ticket_seller }
    end
  end

  # GET /ticket_sellers/new
  # GET /ticket_sellers/new.xml
  def new
    @ticket_seller = TicketSeller.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @ticket_seller }
    end
  end

  # GET /ticket_sellers/1/edit
  def edit
    @ticket_seller = TicketSeller.find(params[:id])
  end

  # POST /ticket_sellers
  # POST /ticket_sellers.xml
  def create
    @ticket_seller = TicketSeller.new(params[:ticket_seller])

    respond_to do |format|
      if @ticket_seller.save
        flash[:notice] = 'TicketSeller was successfully created.'
        format.html { redirect_to(admin_ticket_seller(@ticket_seller)) }
        format.xml  { render :xml => @ticket_seller, :status => :created, :location => @ticket_seller }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @ticket_seller.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /ticket_sellers/1
  # PUT /ticket_sellers/1.xml
  def update
    @ticket_seller = TicketSeller.find(params[:id])

    respond_to do |format|
      if @ticket_seller.update_attributes(params[:ticket_seller])
        flash[:notice] = 'TicketSeller was successfully updated.'
        format.html { redirect_to(admin_ticket_seller(@ticket_seller)) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @ticket_seller.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /ticket_sellers/1
  # DELETE /ticket_sellers/1.xml
  def destroy
    @ticket_seller = TicketSeller.find(params[:id])
    @ticket_seller.destroy

    respond_to do |format|
      format.html { redirect_to(admin_ticket_sellers_url) }
      format.xml  { head :ok }
    end
  end
end
