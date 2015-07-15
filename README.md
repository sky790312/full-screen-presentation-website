# updownleftright site

try to make full screen presentation
with bootstrap and jquery

prototype:
1. remember last section you view!
2. change each section bkg, title, text color!
3. can use by keyboard or just click!

#useing:

1. one page only(one section children only):

				<section>
					<section data-bkgcolor="#000" data-titlecolor="#fff" data-textcolor="#fff" data-index="0">
						<h1>start</h1>
						<h3>my presentation</h3>
					</section>
				</section>

2. multiple page(multiple section children only):

				<section>
					<section data-bkgcolor="#546" data-titlecolor="#f0f" data-textcolor="#0ff" data-index="2/1">
						<h1>section 4</h1>
						<h3>can use by the keyborad</h3>
					</section>
					<section data-bkgcolor="#c66" data-titlecolor="#fff" data-textcolor="#cfc" data-index="2/2">
						<h1>section 5</h1>
						<h3>or just click!!</h3>
					</section>
				</section>

#padding:
				<h3>adding the hash tag</h3>
				<h3>adding percentage</h3>
				<h3>adding sitemap</h3>
				<h3>adding more css effective</h3>