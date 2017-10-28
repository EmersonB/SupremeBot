# -*- coding: utf-8 -*-
import logging
logging.basicConfig()
from multiprocessing.dummy import Pool as ThreadPool
from bs4 import BeautifulSoup as bs
import requests
import timeit
import datetime
import time
import sys
import re
from getconf import *
reload(sys)
sys.setdefaultencoding('utf8')


# TO DO: scrape for early links
# Constants
base_url = 'http://www.supremenewyork.com'

# Inputs
#keywords_category = ['accessories']  # Demo stuff, feel free to change
#keywords_model = ['tagless', 'hanes', 'tee']
#keywords_style = ['black']

#size = 'medium'

keywords_category = sys.argv[1].split()  # Demo stuff, feel free to change
keywords_model = sys.argv[2].split()
keywords_style = sys.argv[3].split()

size = sys.argv[4]

use_early_link = False

early_link = ''
# early_link = 'http://www.supremenewyork.com/shop/jackets/nzpacvjtk' #sold out
# early_link = 'http://www.supremenewyork.com/shop/shirts/r1k32vjf4/sblz8csj2' # mult sizes
# early_link = 'http://www.supremenewyork.com/shop/accessories/kcgevis8r/xiot9byq4' #one size


# Functions
def product_page(url):
        ##print(url)
	#print('Finding matching products...')
	session = requests.Session()
	session.headers.update({
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) '
		              'Chrome/52.0.2743.116 Safari/537.36',
		'X-XHR-Referer': 'http://www.supremenewyork.com/shop/all',
		'Referer': 'http://www.supremenewyork.com/shop/all/bags',
		'Accept': 'text/html, application/xhtml+xml, application/xml',
		'Accept-Encoding': 'gzip, deflate, sdch',
		'Accept-Language': 'en-US,en;q=0.8,da;q=0.6',
		'DNT': '1'
	})

	response = session.get(base_url + url)
	soup = bs(response.text, 'html.parser')

	h1 = soup.find('h1', {'itemprop': 'name'})

	p = soup.find('p', {'itemprop': 'model'})

	match = []

	if h1 is not None and p is not None:
		model = h1.string
		style = p.string
		for keyword in keywords_model:
			if keyword.title() in model:
				match.append(1)
			else:
				match.append(0)
		# add to cart
		if 0 not in match:
			match = []
			for keyword in keywords_style:
				if keyword.title() in style:
					match.append(1)
				else:
					match.append(0)
			if 0 not in match:
				##print('FOUND: ' + model + ' at ' + base_url + url)
				return(base_url+url)
				#add_to_cart(soup, base_url+url)
			else:
				#sys.exit('Sorry, couldnt find {} in {}'.format(model, style))
                                #return ('Sorry, couldnt find {} in {}'.format(model, style))
                                return None

def on_time():
	# Main
	#print(datetime.datetime.now())
	start = timeit.default_timer()

	session1 = requests.Session()
	session1.headers.update({
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) '
		              'Chrome/52.0.2743.116 Safari/537.36',
		'Upgrade-Insecure-Requests': '1',
		'DNT': '1',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding': 'gzip, deflate, sdch',
		'Accept-Language': 'en-US,en;q=0.8,da;q=0.6'
	})

	if use_early_link:
		try:
			response1 = session1.get(early_link)
			soup = bs(response1.text, 'html.parser')
		except:
			sys.exit('Unable to connect to site...')
		add_to_cart(soup, early_link)
	else:
		try:
			url = base_url + '/shop/all/' + keywords_category[0] + '/'
			response1 = session1.get(url)
		except:
			sys.exit('Unable to connect to site...')
		soup1 = bs(response1.text, 'html.parser')
		links1 = soup1.find_all('a', href=True)
		links_by_keyword1 = []
		for link in links1:
			for keyword in keywords_category:
				product_link = link['href']
				if keyword in product_link and 'all' not in product_link:
					if product_link not in links_by_keyword1:
						links_by_keyword1.append(link['href'])
		pool1 = ThreadPool(len(links_by_keyword1))
		result1 = pool1.map(product_page, links_by_keyword1)  # runtime
                pool1.close()
                pool1.join()
                while None in result1:
                        result1.remove(None)
                return result1


print(on_time()[0])
