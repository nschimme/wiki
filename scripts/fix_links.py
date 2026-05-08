import os
import re

replacements = {
    'Ancient_Broken_Road.md': '../lore.md#ancient-broken-road',
    'Ash_arrow.md': './Weapon.md#missiles',
    'Belts.md': './Armour.md#belts',
    'Blackened_bolt.md': './Weapon.md#missiles',
    'Bolt.md': './Weapon.md#missiles',
    'Bree_Armourer.md': './Bree.md#shops',
    'Brush.md': './Items.md#brush',
    'Cities.md': '../lore.md',
    'Cloaks.md': './Armour.md#about-body',
    'Cloth_equipment.md': './Armour.md#cloth',
    'Consumables.md': './Items.md#consumables',
    'Containers.md': './Items.md#containers',
    'Crossbow.md': './Weapon.md#missile-weapons',
    'Direction.md': './Mechanics.md#direction',
    'Drink.md': './Items.md#drink',
    'Dwarvish_names.md': '../races.md#racial-flavor',
    'Dúnadan_blade.md': './Weapon.md#slashing-weapons',
    'Easterling.md': '../lore.md#easterlings',
    'Effort.md': './Mechanics.md#effort',
    'Elven_shortbow.md': './Weapon.md#missile-weapons',
    'Eregion.md': '../lore.md#eregion',
    'Forlond_Grocer.md': './Grey_Havens.md#forlond',
    'Forlond_Tailor.md': './Grey_Havens.md#forlond',
    'Fornost_Armourer.md': './Fornost.md#inhabitants',
    'Fornost_Baker.md': './Fornost.md#shops',
    'Fornost_Grocer.md': './Fornost.md#shops',
    'Fornost_Weaponsmith.md': './Fornost.md#inhabitants',
    'Guildmasters.md': './Help.md#guildmasters',
    'Haradrim.md': '../lore.md#haradrim',
    'Harlond_Grocer.md': './Grey_Havens.md#harlond',
    'Harlond_Tailor.md': './Grey_Havens.md#harlond',
    'Isengard.md': '../lore.md#isengard',
    'Item.md': './Items.md#item',
    'Jail.md': './Mechanics.md#jail',
    'Keys.md': './Items.md#keys',
    'Knock.md': './Mechanics.md#knock',
    'Leaflock.md': './Fangorn.md#unique-mobiles',
    'Leather_equipment.md': './Armour.md#leather',
    'Levels.md': './Mechanics.md#levels',
    'Light_crossbow.md': './Weapon.md#missile-weapons',
    'Local_editing.md': './External_links.md#tools--information',
    'MUME_IX.md': '../history.md#version-timeline',
    'Mail_equipment.md': './Armour.md#chain',
    'Massive_roots.md': './Fangorn.md#plants',
    'Metal-cased_bolt.md': './Weapon.md#missiles',
    'Metal_equipment.md': './Armour.md#metal',
    'Mirkwood.md': '../lore.md#mirkwood',
    'Missile_weapons.md': './Weapon.md#missile-weapons',
    'Mix.md': './Herbal_kit.md#mix',
    'Movement.md': './Mechanics.md#movement',
    'Old_Man_Willow.md': './Old_Forest.md#old-man-willow',
    'Orcish_names.md': '../races.md#racial-flavor',
    'Orkish_shortbow.md': './Weapon.md#missile-weapons',
    'Pandora.md': './External_links.md#mappers--clients',
    'Playable_races.md': '../races.md',
    'Powwow.md': '../history.md#mapper-client-history',
    'Quest_items.md': './Items.md#quest-items',
    'Round_stone.md': './Weapon.md#missiles',
    'Staff_and_Focus_guide.md': './Staff,_Gem_and_Focus_guide.md',
    'Sting.md': './Weapon.md#piercing-weapons',
    'Tharbad_Armourer.md': './Tharbad.md#shops',
    'Tharbad_Weaponsmith.md': './Tharbad.md#shops',
    'Tintin++.md': './External_links.md#mappers--clients',
    'TinyFugue.md': './External_links.md#mappers--clients',
    'Tolkien.md': './External_links.md#tolkien',
    'Trollshaws.md': '../lore.md#trollshaws',
    'War_arrow.md': './Weapon.md#missiles',
    'Warrens.md': './Trollshaws.md#warrens',
    'Weapons.md': './Weapon.md',
    'Wikibot.md': './External_links.md#tools--information',
    'room.md': './Mechanics.md#room'
}

def fix_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    is_in_pages = filepath.startswith('docs/pages/')

    for old_file, new_link in replacements.items():
        actual_new_link = new_link
        if not is_in_pages:
            if actual_new_link.startswith('./'):
                actual_new_link = './pages/' + actual_new_link[2:]
            elif actual_new_link.startswith('../'):
                actual_new_link = './' + actual_new_link[3:]

        content = content.replace(f"(./{old_file})", f"({actual_new_link})")
        content = content.replace(f"({old_file})", f"({actual_new_link})")
        old_name_no_ext = old_file.replace(".md", "")
        content = content.replace(f"(/pages/{old_name_no_ext})", f"({actual_new_link})")

    for old_file, new_link in replacements.items():
        old_name = old_file.replace(".md", "")
        href_link = new_link.replace(".md", "")
        if not is_in_pages:
            if href_link.startswith('./'):
                href_link = './pages/' + href_link[2:]
            elif href_link.startswith('../'):
                href_link = './' + href_link[3:]

        content = content.replace(f"href: './{old_name}'", f"href: '{href_link}'")
        content = content.replace(f"href: '{old_name}'", f"href: '{href_link}'")

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

for root, dirs, files in os.walk('docs'):
    for file in files:
        if file.endswith('.md'):
            fix_links(os.path.join(root, file))
