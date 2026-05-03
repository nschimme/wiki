---
title: Shop commands
description: 'Use these commands in shops. ''Buy'' can also be'
tags:
  - Help files
  - Commands
---
Use these **commands** in [shops](./Shop.md). 'Buy' can also be
used in stables/pet-shops.

**Buy** syntax:

` buy [&lt;1..20&gt;|&lt;one...twenty&gt; of] `&lt;keyword&gt;`|`&lt;number&gt;

**Dye** syntax:

` dye `&lt;keyword&gt;` `&lt;colour&gt;

**Resize** allows you to instantly resize an item.

Resize syntax:

` resize `&lt;name&gt;

**Sell** syntax:

` sell [`&lt;number&gt;`.|all.]`&lt;keyword&gt;

**List** shows you what you can buy in the shops and the price of every
item.

List syntax:

` list { `&lt;keywords&gt;` or `&lt;number&gt;` }`

Use &lt;keyword&gt; to list items matching the keyword. If there are more than
one pieces of a particular item in the shop inventory, you can get an
itemized list of those pieces by using the &lt;number&gt; parameter. You can
also try these:

<div class="wiki-block">

 list worn {head|body|on body|about body|...}<br> list weapons that {slash|pierce|crush|cleave|...}<br> list wielded {with one hand|with two hands|dual}<br> list edible<br> list containers<br> list filter {[-]keyword} worn {head|body|on body|about body|...} (*)

</div>

(\*) Note: The filter sub-command only allows one keyword.

**Show** allows you to consider an item in the shop.

Show syntax:

` show { `&lt;keywords&gt;` or `&lt;number&gt;` }`

**Value** lets you know how much a shopkeeper would pay for a certain
item without actually selling it.

Value syntax:

` value `&lt;name&gt;

Examples:

<div class="wiki-block">

 \> show 43      <br> \> buy a dozen war arrows <br> \> sell all.metal<br> \> list worn on legs<br> \> list wall shield<br> \> dye shirt black<br> \> value eket<br> \> resize 1.breastplate<br> \> buy horse Shadowfax       (to name your horse, for use in pet-shops)

</div>

See also: [Shop](./Shop.md), [Mend](./Mend.md),
[Citizen](./Citizen.md)
